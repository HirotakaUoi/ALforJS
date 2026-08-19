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
    accent: '#f0a83d',
};
function loadSettings() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('algo-runner-settings') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
}
let settings = loadSettings();
document.documentElement.style.setProperty('--accent', settings.accent);

// ====== 読み取り専用ブロックに出す説明 ======
const LIB_TEXT = [
    '// この2つは実行環境が用意します。プログラム側で書く必要はありません。',
    '// （Node版の require("./io.js"); と同じ役割です）',
    '',
    'function output(s) {',
    '    // C++の cout << 相当。改行なしでターミナルに出力する',
    '}',
    '',
    'async function input(msg) {',
    '    // C++の cin >> 相当。ターミナルに入力欄を出し、',
    '    // Enter が押されるまで待って、入力された文字列を返す',
    '    // 呼び出し側は  await input("...")  と書く',
    '}',
].join('\n');
document.getElementById('libCode').textContent = LIB_TEXT;

// ====== 貼り付けられたソースを、この環境で動く形に整える ======
// Node版をファイルごと貼っても動くように、環境依存の行を取り除く
function normalizeSource(src) {
    let lines = src.replace(/\r\n/g, '\n').split('\n');

    // 1. 先頭の共通ブロック（「// ======…」で始まり「// ====…」だけの行で終わる）
    if (/^\/\/ =+/.test((lines[0] || '').trim())) {
        const end = lines.findIndex(l => /^\/\/ =+$/.test(l.trim()));
        if (end > 0) lines = lines.slice(end + 1);
    }
    // 2. require( を含む行（Node専用）
    lines = lines.filter(l => !/\brequire\s*\(/.test(l));
    // 3. main() を呼び出しているだけの行（実行はこの環境が行う）
    lines = lines.filter(l => !/^\s*(if\s*\(\s*isNode\s*\)\s*)?main\s*\(\s*\)\s*(\.\s*\w+\s*\([^)]*\))?\s*;/.test(l));

    return lines.join('\n').replace(/^\n+/, '').replace(/\s+$/, '');
}

// ====== iframe に流し込む HTML を組み立てる ======
const TAG = String.fromCharCode(60) + 'script';
const TAGC = String.fromCharCode(60) + '/script>';

function buildSrcDoc(studentCode, needP5) {
    // io.js の中身をそのまま iframe の中へ持ち込む
    const lib = '(' + ioLibrary.toString() + ')();';

    // main() があれば呼ぶ。setup() や draw() があるスケッチなら p5 が自動で動かす
    // （setup を書かず draw だけのスケッチもあるので、どちらかがあればスケッチとみなす）
    const boot = [
        'var __isSketch = typeof setup === "function" || typeof draw === "function";',
        '(async function(){',
        '  try {',
        '    if (typeof main === "function") { await main(); }',
        '    else if (!__isSketch) { window.__reportError("main() が見つかりません"); return; }',
        '    window.__finish(__isSketch);',
        '  } catch (e) { window.__reportError((e && e.message) || e); }',
        '})();',
    ].join('\n');

    return '<!DOCTYPE html><html><head><meta charset="utf-8">'
        + '<style>html,body{margin:0;background:#111116;overflow:hidden;}</style>'
        + TAG + '>' + lib + TAGC
        + (needP5 ? TAG + ' src="' + settings.p5url + '">' + TAGC : '')
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
}
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
    const src = normalizeSource(document.getElementById('code').value);
    term.textContent = '';
    outEl = null;
    clearInputBox();
    autoShown = false;
    if (!openedByUser) setCanvas(false);   // 前回自動で開いたキャンバスは閉じておく
    addLine('l-sys', '— 実行を開始しました —');
    setRunning(true);
    // キャンバスを使いそうなときだけ p5.js を読み込む
    const needP5 = CANVAS_ENABLED && /\b(setup|draw|createCanvas)\s*\(/.test(src);
    renewFrame().srcdoc = buildSrcDoc(src, needP5);
    watchAlive();
}

function stop() {
    clearTimeout(aliveTimer);
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
    else if (d.type === 'out') addOutput(d.text);
    else if (d.type === 'input') askInput();
    else if (d.type === 'error') { addError(d.message); setRunning(false); }
    else if (d.type === 'canvas') { if (!autoShown) { autoShown = true; setCanvas(true); } }
    else if (d.type === 'done') {
        breakOutput();
        addLine('l-sys', d.sketch ? '— スケッチを実行中です —' : '— 実行が終わりました —');
        // スケッチは draw() が回り続けるので、中止ボタンは押せるままにする
        setRunning(d.sketch, true);
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
    document.getElementById('setAccent').value = settings.accent;
    dlg.showModal();
};
document.getElementById('setCancel').onclick = () => dlg.close();
document.getElementById('setReset').onclick = () => {
    document.getElementById('setP5').value = DEFAULTS.p5url;
    document.getElementById('setAccent').value = DEFAULTS.accent;
};
document.getElementById('setSave').onclick = () => {
    settings = {
        p5url: document.getElementById('setP5').value.trim() || DEFAULTS.p5url,
        accent: document.getElementById('setAccent').value.trim() || DEFAULTS.accent,
    };
    localStorage.setItem('algo-runner-settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--accent', settings.accent);
    dlg.close();
};

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
    '    const N = 8;',
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

codeEl.value = localStorage.getItem('algo-runner-code') || SAMPLE;
