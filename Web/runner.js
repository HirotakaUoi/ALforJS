// ====== 実行環境のエンジン（HTML版・p5.js版で共用）======
//
// やっていること:
//   1. コード欄の内容を、この環境で動く形に整える（Node版をそのまま貼れるようにする）
//   2. sandbox 付き iframe の中で走らせる。output / input は io.js が用意する
//   3. 出力・入力要求・エラー・キャンバス生成を postMessage で受け取り、画面に反映する
//
// iframe の中で動かすのは、実行のたびに完全にまっさらな状態から始めるため。
// タイマーも p5 の draw() も、iframe を捨てればまとめて消える。
//
// ページ側は <body data-canvas="on|off"> でキャンバスの有無を指定する。

const CANVAS_ENABLED = document.body.dataset.canvas === 'on';

// ====== 設定（localStorage に保存。file:// でも効く）======
const DEFAULTS = {
    p5url: 'https://cdn.jsdelivr.net/npm/p5@2/lib/p5.min.js',
    p5url1: 'https://cdn.jsdelivr.net/npm/p5@1/lib/p5.min.js',
    accent: '#f0a83d',
};
function loadSettings() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('algo-runner-settings') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
}
let settings = loadSettings();
document.documentElement.style.setProperty('--accent', settings.accent);

// ====== 読み取り専用ブロックに出す説明 ======
// 実物をそのまま見せる。手で書き写すと io.js を直したときに必ずずれるので、
// 実際に iframe へ送り込んでいる ioLibrary の中身から定義を切り出す
function pickFunction(src, name) {
    const start = src.indexOf('function ' + name);
    if (start < 0) return '';
    let depth = 0;
    for (let i = src.indexOf('{', start); i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}' && --depth === 0) {
            return src.slice(start, i + 1).replace(/\n {4}/g, '\n');   // 1段ぶん左に寄せる
        }
    }
    return '';
}

const LIB_TEXT = (() => {
    const src = ioLibrary.toString();
    const out = pickFunction(src, 'myOutput');
    const inp = pickFunction(src, 'myInput');
    const head = [
        '// この3つは実行環境が用意します。プログラム側で書く必要はありません。',
        '// スライドのソースにある require("./io.js"); と同じ役割です。',
        '// 下がその中身で、output / input / close という名前で使えます。',
        '',
        '',
    ].join('\n');
    // 切り出せなかったときは io.js 全体を出す（空欄になるよりはよい）
    if (!out || !inp) return head + src;
    return head + out + '\n\n' + inp
        + '\n\nwindow.close = function () { };   // 形をそろえるためのもの（何もしません）';
})();
document.getElementById('libCode').textContent = LIB_TEXT;

// ====== 貼り付けられたソースを、この環境で動く形に整える ======
// Node版をファイルごと貼っても動くように、環境依存の行を取り除く
// 取り除く行は「消す」のではなく「空行にする」。こうするとコード欄と行番号が
// ぴったり一致するので、実行行のハイライトがそのまま使える
function normalizeSource(src) {
    const lines = src.replace(/\r\n/g, '\n').split('\n');

    // 1. 先頭の共通ブロック（「// ======…」で始まり「// ====…」だけの行で終わる）
    if (/^\/\/ =+/.test((lines[0] || '').trim())) {
        const end = lines.findIndex(l => /^\/\/ =+$/.test(l.trim()));
        if (end > 0) for (let i = 0; i <= end; i++) lines[i] = '';
    }
    for (let i = 0; i < lines.length; i++) {
        // 2. require( を含む行（Node専用）
        if (/\brequire\s*\(/.test(lines[i])) lines[i] = '';
        // 3. main() を呼び出しているだけの行（実行はこの環境が行う）
        if (/^\s*(if\s*\(\s*isNode\s*\)\s*)?main\s*\(\s*\)\s*(\.\s*\w+\s*\([^)]*\))?\s*;/.test(lines[i])) lines[i] = '';
    }
    return lines.join('\n');
}

// ====== 動作ハイライト用に、行の頭へ目印を挿し込む ======
// 各文の先頭に __L(行番号) を置くだけ。__L は現在の行を覚えるだけの軽い関数なので、
// 挿し込んでもプログラムの結果は変わらない。
//
// 波かっこを省いた制御文の本体（for (…) の次の行など）に挿すと構造が壊れるため、
// 「直前の実コード行が ; { } のどれかで終わっている」ときだけ挿す。
// 途中で改行した式の続き（行末が ) や && や = など）も、この条件で自然に除外される。
function instrument(src) {
    const lines = src.split('\n');
    let prev = '';
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t === '' || t.startsWith('//')) continue;
        const startsStatement = /[;{}]$/.test(prev) || prev === '';
        const skip = /^[}\])]/.test(t) || /^(else|case|default|do)\b/.test(t);
        if (startsStatement && !skip) {
            const indent = lines[i].match(/^\s*/)[0];
            lines[i] = indent + '__L(' + (i + 1) + ');' + lines[i].slice(indent.length);
        }
        prev = t;
    }
    return lines.join('\n');
}

// ====== iframe に流し込む HTML を組み立てる ======
const TAG = String.fromCharCode(60) + 'script';
const TAGC = String.fromCharCode(60) + '/script>';

function buildSrcDoc(studentCode, p5src, traceOn) {
    // io.js の中身をそのまま iframe の中へ持ち込む
    const lib = 'window.__traceOn = ' + (traceOn ? 'true' : 'false') + ';\n'
        + '(' + ioLibrary.toString() + ')();';

    // main() があれば呼ぶ。setup() や draw() があるスケッチなら p5 が自動で動かす
    // （setup を書かず draw だけのスケッチもあるので、どちらかがあればスケッチとみなす）
    const boot = [
        'var __isSketch = typeof setup === "function" || typeof draw === "function";',
        // p5 はスケッチの中で起きた例外を自前で受け止めてしまい、window.onerror に
        // 届かないことがある（キャンバスが真っ黒なまま何も出ない）。包んで必ず表示する。
        // draw() は毎フレーム回るので、一度出したら止める
        'var __failed = false;',
        '["preload", "setup", "draw"].forEach(function (name) {',
        '  var f = window[name];',
        '  if (typeof f !== "function") return;',
        '  window[name] = function () {',
        '    if (name === "draw") __started = true;',
        '    try {',
        '      var r = f.apply(this, arguments);',
        '      if (r && typeof r.then === "function") {',
        '        return r.then(function (v) { if (name === "setup") __started = true; return v; }, __sketchError);',
        '      }',
        '      if (name === "setup") __started = true;',
        '      return r;',
        '    } catch (e) { __sketchError(e); }',
        '  };',
        '});',
        // console.error を致命的とみなすのは、スケッチがまだ動き出していないときだけ。
        // preload() の読み込み失敗はここに当たる（setup() が永久に呼ばれない）。
        // 動き出したあとの読み込み失敗は、絵は描き続けられるので表示だけにする
        'var __started = false;',
        'window.__isFatalConsole = function () { return __isSketch && !__started; };',
        'function __sketchError(e) {',
        '  if (__failed) return;',
        '  __failed = true;',
        '  window.__reportError((e && e.message) || e);',
        '  if (typeof window.noLoop === "function") { try { noLoop(); } catch (x) {} }',
        '}',
        '(async function(){',
        '  try {',
        '    if (typeof main === "function") { await main(); }',
        '    else if (!__isSketch) { window.__reportError("main() が見つかりません"); return; }',
        '    window.__finish(__isSketch);',
        '  } catch (e) { window.__reportError((e && e.message) || e); }',
        '})();',
    ].join('\n');

    return '<!DOCTYPE html><html><head><meta charset="utf-8">'
        // キャンバスは枠の中央に置く（大きすぎるものを縮めるのは io.js の側）
        + '<style>html,body{margin:0;height:100%;background:#111116;overflow:hidden;}'
        + 'body{display:flex;align-items:center;justify-content:center;}'
        + 'canvas{display:block;}</style>'
        + TAG + '>' + lib + TAGC
        + (p5src ? TAG + ' src="' + p5src + '">' + TAGC : '')
        + '</head><body>'
        + TAG + '>' + studentCode + TAGC
        + TAG + '>' + boot + TAGC
        + '</body></html>';
}

// ====== ターミナル ======
const term = document.getElementById('terminal');
function scrollTerm() { term.scrollTop = term.scrollHeight; }
function addLine(cls, text) {
    const el = document.createElement('div');
    el.className = cls;
    el.textContent = text;
    term.appendChild(el);
    scrollTerm();
    return el;
}
let outEl = null;                       // 連続する出力は1つの要素にまとめる
function addOutput(text) {
    if (!outEl) { outEl = document.createElement('span'); outEl.className = 'l-out'; term.appendChild(outEl); }
    outEl.textContent += text;
    scrollTerm();
}
function breakOutput() { outEl = null; }

function jpErrorSummary(m) {
    m = String(m || '');
    let x;
    if ((x = m.match(/(\S+) is not defined/))) return '『' + x[1] + '』が見つかりません（定義忘れ・スペルミスの可能性）';
    if ((x = m.match(/(\S+) is not a function/))) return '『' + x[1] + '』は関数ではありません';
    if (/Unexpected|Invalid or unexpected/.test(m)) return '書き方が正しくありません（かっこや引用符の対応を確かめてください）';
    if (/Cannot read propert/.test(m)) return '値が入っていないものを使おうとしました';
    if (/Maximum call stack/.test(m)) return '再帰が止まらなくなりました（終了条件を確かめてください）';
    if (/await is only valid|await 式/.test(m)) return 'await は async function の中でしか使えません';
    return 'エラーが起きました';
}
function addError(message) {
    breakOutput();
    const line = addLine('l-err', '▶ エラー: ' + jpErrorSummary(message));
    const detail = document.createElement('div');
    detail.className = 'err-detail';
    detail.textContent = message;
    detail.hidden = true;
    term.appendChild(detail);
    line.onclick = () => {
        detail.hidden = !detail.hidden;
        line.textContent = (detail.hidden ? '▶' : '▼') + ' エラー: ' + jpErrorSummary(message);
    };
    scrollTerm();
}

// ====== 入力待ち ======
let waiting = false;
function askInput() {
    // プロンプトはすでに output() で出ているので、その続き（同じ行）に入力欄を置く
    const box = document.createElement('input');
    box.id = 'stdin';
    box.type = 'text';
    box.autocomplete = 'off';
    term.appendChild(box);
    outEl = null;                       // 次の出力は入力欄より後ろに出す
    box.focus();
    waiting = true;
    scrollTerm();
    box.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        e.stopPropagation();
        const v = box.value;
        // 端末のエコーのように、入力した値をその場に残して改行する
        const echo = document.createElement('span');
        echo.className = 'l-echo';
        echo.textContent = v + '\n';
        term.replaceChild(echo, box);
        waiting = false;
        frame.contentWindow.postMessage({ type: 'input-response', value: v }, '*');
    });
}
term.addEventListener('click', () => { if (waiting) { const b = document.getElementById('stdin'); if (b) b.focus(); } });

function clearInputBox() {
    const box = document.getElementById('stdin');
    if (box) box.remove();
    waiting = false;
}

// ====== キャンバスの表示 ======
const mainEl = document.getElementById('main');
const btnCanvas = document.getElementById('btnCanvas');
let canvasOpen = false;
let autoShown = false;                  // 実行1回につき自動表示は1度だけ
let openedByUser = false;               // 手で開いたものは実行しても閉じない
function setCanvas(open) {
    if (!CANVAS_ENABLED) return;
    canvasOpen = open;
    mainEl.classList.toggle('canvas-open', open);
    btnCanvas.querySelector('.tri').classList.toggle('open', open);
    if (open) sendFit();
}

// キャンバスを枠に収め直させる。枠が 0 幅の間は iframe 側が何も測れないので、
// 開くアニメーション（.15s）が終わってから頼む。p5 の初期化が遅れることもあるので二度送る
function sendFit() {
    [200, 800].forEach((ms) => setTimeout(() => {
        if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'fit' }, '*');
    }, ms));
}
window.addEventListener('resize', () => { if (canvasOpen) sendFit(); });
if (btnCanvas) btnCanvas.onclick = () => { openedByUser = !canvasOpen; setCanvas(!canvasOpen); };

// ====== 実行 ======
let frame = document.getElementById('frame');
const btnRun = document.getElementById('btnRun');
const btnStop = document.getElementById('btnStop');

// iframe をいったんDOMから外して付け直す。srcdoc を差し替えるだけだと、
// 前の実行のタイマーやループが残ることがあるが、外した時点で中身ごと破棄される。
// （createElement で新しく作る手もあるが、sandbox 付きの iframe を動的に作ると
//   スクリプトを実行しないブラウザがあるため、元の要素を使い回す）
function renewFrame() {
    const parent = frame.parentNode;
    const next = frame.nextSibling;
    frame.remove();
    frame.removeAttribute('srcdoc');   // 付け直したときに前回の内容が動き出さないように
    parent.insertBefore(frame, next);
    return frame;
}

function setRunning(running, keepRunEnabled) {
    btnRun.disabled = running && !keepRunEnabled;
    btnStop.disabled = !running;
}

// 実行環境が生きているかの見張り。iframe は読み込まれた直後に ready を返すので、
// それが来なければ前の実行の無限ループでプロセスが塞がったままだと判断する
// （暴走中のスクリプトはブラウザからも中断できないため、ページの読み込み直しが要る）
let aliveTimer = null;
function watchAlive() {
    clearTimeout(aliveTimer);
    aliveTimer = setTimeout(() => {
        breakOutput();
        addLine('l-err', '実行環境が応答しません。前の無限ループが止まりきっていない可能性があります。');
        const btn = document.createElement('button');
        btn.textContent = 'ページを読み込み直す';
        btn.style.cssText = 'margin:8px 0;font-size:12px;';
        btn.onclick = () => location.reload();
        term.appendChild(btn);
        scrollTerm();
        setRunning(false);
    }, 3000);
}

function run() {
    let src = normalizeSource(document.getElementById('code').value);
    // 動作ハイライトは「実行中に記録して、あとから再生する」方式なので、
    // 実時間で描き進むスケッチには使えない（キャンバスだけ先に描き終わってしまう）
    const isSketch = /\bfunction\s+(setup|draw)\s*\(/.test(src);
    const highlight = chkHighlight.checked && !isSketch;
    const highlightSkipped = chkHighlight.checked && isSketch;
    if (highlight) src = instrument(src);
    resetReplay();
    traceMode = highlight;
    setHighlightLine(0);
    term.textContent = '';
    outEl = null;
    clearInputBox();
    autoShown = false;
    if (!openedByUser) setCanvas(false);   // 前回自動で開いたキャンバスは閉じておく
    addLine('l-sys', '— 実行を開始しました —');
    if (highlightSkipped) {
        addLine('l-sys', '— スケッチでは動作ハイライトは使えません（描画が実時間で進むため）—');
    }
    setRunning(true);
    // キャンバスを使いそうなときだけ p5.js を読み込む
    const needP5 = CANVAS_ENABLED && /\b(setup|draw|createCanvas)\s*\(/.test(src);
    // preload() は p5.js 2 で廃止された。web で拾ってきた 1 系向けのスケッチは
    // そのままでは読み込みが動かないので、見つけたら 1 系のほうで実行する
    const usesPreload = needP5 && /\bfunction\s+preload\s*\(/.test(src);
    if (usesPreload) {
        addLine('l-sys', '— preload() があるので p5.js 1 系で実行します（2 では呼ばれないため）—');
    }
    const p5src = needP5 ? (usesPreload ? settings.p5url1 : settings.p5url) : '';
    renewFrame().srcdoc = buildSrcDoc(src, p5src, highlight);
    watchAlive();
}

function stop() {
    clearTimeout(aliveTimer);
    resetReplay();
    renewFrame();
    clearInputBox();
    breakOutput();
    addLine('l-sys', '— 実行を中止しました —');
    setRunning(false);
}

window.addEventListener('message', (e) => {
    if (e.source !== frame.contentWindow) return;
    const d = e.data || {};
    if (d.type === 'ready') clearTimeout(aliveTimer);
    else if (d.type === 'trace') pushTrace(d.items);
    else if (d.type === 'traceoff') {
        pushTrace([{ sys: '— 記録が長すぎるので、ここから先はハイライトなしで表示します —' }]);
    }
    // ハイライト中は、記録を打ち切ったあとの出力も再生の列に並べる（順序を保つため）
    else if (d.type === 'out') { if (traceMode) pushTrace([d.text]); else addOutput(d.text); }
    else if (d.type === 'input') afterReplayDone(askInput);
    else if (d.type === 'error') afterReplayDone(() => { addError(d.message); setRunning(false); });
    // console.error は原文のまま出す。スケッチが動き出す前のものは
    // そのまま止まってしまう（preload() の読み込み失敗など）ので実行を打ち切る
    else if (d.type === 'console-error') afterReplayDone(() => {
        breakOutput();
        addLine('l-err', '▶ ' + d.text);
        if (d.fatal) stop();
    });
    else if (d.type === 'canvas') { if (!autoShown) { autoShown = true; setCanvas(true); } }
    else if (d.type === 'done') {
        afterReplayDone(() => {
            breakOutput();
            addLine('l-sys', d.sketch ? '— スケッチを実行中です —' : '— 実行が終わりました —');
            // スケッチは draw() が回り続けるので、中止ボタンは押せるままにする
            setRunning(d.sketch, true);
        });
    }
});

btnRun.onclick = run;
btnStop.onclick = stop;
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !btnRun.disabled) { e.preventDefault(); run(); }
    if (e.key === 'Escape' && !btnStop.disabled) { e.preventDefault(); stop(); }
});

// ====== 折りたたみ ======
const libHead = document.getElementById('libHead');
const libCode = document.getElementById('libCode');
libHead.onclick = () => {
    libCode.hidden = !libCode.hidden;
    libHead.querySelector('.tri').classList.toggle('open', !libCode.hidden);
};

// ====== 設定画面 ======
const dlg = document.getElementById('settings');
document.getElementById('btnSettings').onclick = () => {
    document.getElementById('setP5').value = settings.p5url;
    document.getElementById('setP51').value = settings.p5url1;
    document.getElementById('setAccent').value = settings.accent;
    dlg.showModal();
};
document.getElementById('setCancel').onclick = () => dlg.close();
document.getElementById('setReset').onclick = () => {
    document.getElementById('setP5').value = DEFAULTS.p5url;
    document.getElementById('setP51').value = DEFAULTS.p5url1;
    document.getElementById('setAccent').value = DEFAULTS.accent;
};
document.getElementById('setSave').onclick = () => {
    settings = {
        p5url: document.getElementById('setP5').value.trim() || DEFAULTS.p5url,
        p5url1: document.getElementById('setP51').value.trim() || DEFAULTS.p5url1,
        accent: document.getElementById('setAccent').value.trim() || DEFAULTS.accent,
    };
    localStorage.setItem('algo-runner-settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--accent', settings.accent);
    dlg.close();
};

// ====== 動作ハイライト ======
const chkHighlight = document.getElementById('chkHighlight');
const hlLine = document.getElementById('hlLine');
const codeArea = document.getElementById('code');

function syncHighlightUI() {
    document.body.classList.toggle('highlight-on', chkHighlight.checked);
    if (!chkHighlight.checked) hlLine.hidden = true;
}
chkHighlight.checked = localStorage.getItem('algo-runner-highlight') === '1';
syncHighlightUI();
chkHighlight.addEventListener('change', () => {
    localStorage.setItem('algo-runner-highlight', chkHighlight.checked ? '1' : '0');
    syncHighlightUI();
});

// 再生中に速さを変えたら、その場で反映する
document.getElementById('hlSpeed').addEventListener('input', () => {
    if (!replayTimer) return;
    clearInterval(replayTimer);
    replayTimer = null;
    startReplay();
});

let hlCurrent = 0;                      // いま光らせている行（1始まり）

// ---- 記録の再生 ----
// 実行中は iframe 側が行と出力を記録し、ここで少しずつ再生する。
// 再生が終わるまでは、入力待ちや終了の表示を待たせる。
let replayQueue = [];
let replayTimer = null;
let traceMode = false;          // この実行が動作ハイライト付きかどうか
let afterReplay = null;                 // 再生し終わってからやること

function replaySpeed() {
    const el = document.getElementById('hlSpeed');
    return el ? Number(el.value) : 60;  // 1秒あたりの手数
}

function stepReplay() {
    // 速いときは1回のタイマーでまとめて進める
    const perTick = Math.max(1, Math.round(replaySpeed() / 60));
    for (let i = 0; i < perTick && replayQueue.length; i++) {
        const it = replayQueue.shift();
        if (typeof it === 'number') setHighlightLine(it);
        else if (typeof it === 'string') addOutput(it);
        else if (it && it.sys) { breakOutput(); addLine('l-sys', it.sys); }
    }
    if (replayQueue.length) return;
    clearInterval(replayTimer);
    replayTimer = null;
    if (afterReplay) { const f = afterReplay; afterReplay = null; f(); }
}

function startReplay() {
    if (replayTimer) return;
    replayTimer = setInterval(stepReplay, Math.max(16, Math.round(1000 / replaySpeed())));
}

function pushTrace(items) {
    replayQueue = replayQueue.concat(items);
    startReplay();
}

// 再生待ちが残っていれば、それが終わってから実行する
function afterReplayDone(fn) {
    if (!replayQueue.length && !replayTimer) fn();
    else afterReplay = fn;
}

function resetReplay() {
    clearInterval(replayTimer);
    replayTimer = null;
    replayQueue = [];
    afterReplay = null;
    traceMode = false;
}

function drawHighlight() {
    if (!hlCurrent) { hlLine.hidden = true; return; }
    const cs = getComputedStyle(codeArea);
    const lh = parseFloat(cs.lineHeight);
    const padTop = parseFloat(cs.paddingTop);
    const top = padTop + (hlCurrent - 1) * lh - codeArea.scrollTop;
    hlLine.style.top = top + 'px';
    hlLine.style.height = lh + 'px';
    hlLine.hidden = false;

    // 画面の外に出ていたら、そこまでスクロールして見せる
    const view = codeArea.clientHeight;
    if (top < 0) codeArea.scrollTop += top - lh;
    else if (top + lh > view) codeArea.scrollTop += top + lh - view + lh;
}

function setHighlightLine(n) {
    hlCurrent = n;
    drawHighlight();
}
codeArea.addEventListener('scroll', drawHighlight);

// ====== エディタとターミナルの境目をドラッグして高さを変える ======
const DEFAULT_TERM_HEIGHT = 260;
const splitter = document.getElementById('splitter');
const termWrap = document.getElementById('termWrap');

function setTermHeight(px, save) {
    const left = termWrap.parentNode;
    // エディタ側にも最低限の高さを残す
    const max = Math.max(120, left.clientHeight - 180);
    const h = Math.min(Math.max(Math.round(px), 90), max);
    termWrap.style.height = h + 'px';
    if (save) { try { localStorage.setItem('algo-runner-term-height', String(h)); } catch (e) { } }
}

splitter.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    splitter.setPointerCapture(e.pointerId);
    splitter.classList.add('dragging');
    document.body.classList.add('resizing');

    const startY = e.clientY;
    const startH = termWrap.getBoundingClientRect().height;
    const onMove = (ev) => setTermHeight(startH - (ev.clientY - startY), false);
    const onUp = () => {
        splitter.removeEventListener('pointermove', onMove);
        splitter.removeEventListener('pointerup', onUp);
        splitter.classList.remove('dragging');
        document.body.classList.remove('resizing');
        setTermHeight(termWrap.getBoundingClientRect().height, true);
    };
    splitter.addEventListener('pointermove', onMove);
    splitter.addEventListener('pointerup', onUp);
});

// ダブルクリックで既定の高さに戻す
splitter.addEventListener('dblclick', () => setTermHeight(DEFAULT_TERM_HEIGHT, true));

// 前回の高さを復元する
const savedHeight = Number(localStorage.getItem('algo-runner-term-height'));
if (savedHeight) setTermHeight(savedHeight, false);
// 窓の大きさが変わったときは、はみ出さないように収め直す
window.addEventListener('resize', () => setTermHeight(termWrap.getBoundingClientRect().height, false));

// ====== コードの自動保存 ======
// 無限ループでページを読み込み直すことがあるので、書いたコードは常に控えておく
const codeEl = document.getElementById('code');
codeEl.addEventListener('input', () => {
    try { localStorage.setItem('algo-runner-code', codeEl.value); } catch (e) { /* 保存できなくても実行はできる */ }
});

const SAMPLE = [
    '// ====== 共通の入出力機能（変更しない）======',
    'require("./io.js");',
    '// ==========================================',
    '',
    'async function main() {',
    '    let d, i, first, last, center;',
    '    const s = [0, 1, 2, 4, 5, 7, 8, 9];',
    '    const N = s.length;',
    '    d = parseInt(await input("Input search number: "), 10);',
    '    first = 0;',
    '    last = N - 1;',
    '    while (first <= last) {             // 探索範囲が空でない間',
    '        output("First = " + first + ",Last = " + last + "\\n");',
    '        center = Math.floor((first + last) / 2);  // 範囲の真ん中を計算',
    '        if (d === s[center]) {          // 範囲の真ん中の値がｄと等しい',
    '            output("Found: " + d + " at index " + center + "\\n");',
    '            return;',
    '        } else if (d < s[center]) {     // 範囲の真ん中の値がｄより大きい',
    '            last = center - 1;          // 範囲の後半分を省く',
    '        } else {                        // 範囲の真ん中の値がｄより小さい',
    '            first = center + 1;         // 範囲の前半分を省く',
    '        }',
    '    }',
    '    output("I can\'t find: " + d + "\\n");',
    '}',
    '',
    'main().finally(close);',
].join('\n');

// p5.js版の既定サンプル。テキスト専用のサンプルだと、開いた直後は
// createCanvas() が呼ばれずキャンバスが出ないため、こちらはスケッチにしてある
const SKETCH_SAMPLE = [
    '// p5.js版のサンプルです。createCanvas() を呼ぶとキャンバスが開きます。',
    '// スライドのプログラムを貼り付ければ、そのまま実行できます。',
    '',
    'const s = [0, 1, 2, 4, 5, 7, 8, 9];',
    '',
    'function setup() {',
    '    const N = s.length;',
    '    createCanvas(42 * N, 240);',
    '    noStroke();',
    '    background(245);',
    '    for (let i = 0; i < N; i++) {   // 配列の中身を棒の高さで表す',
    '        const h = (s[i] + 1) * 20;',
    '        fill(60, 130, 210);',
    '        rect(42 * i + 5, height - h, 32, h);',
    '        fill(70);',
    '        textAlign(CENTER);',
    '        textSize(13);',
    '        text(s[i], 42 * i + 21, height - h - 8);',
    '    }',
    '}',
].join('\n');

codeEl.value = localStorage.getItem('algo-runner-code')
    || (CANVAS_ENABLED ? SKETCH_SAMPLE : SAMPLE);
