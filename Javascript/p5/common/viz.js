// ====== p5.js 可視化エンジン（p5ページ共通・変更しない）======
//
// やっていること:
//   1. アルゴリズムを一度最後まで走らせ、比較・交換の「1手ずつ」を frames に記録する
//   2. 記録した frames を p5.js の draw() で 1コマずつ再生する
//   3. print() の出力も横取りして記録し、アニメーションと同じ速さで少しずつ表示する
//
// 各アルゴリズムの .js 側ですることは次の4つだけ。
//   ・main() の先頭で        rec.init(s, N)
//   ・比較する直前に          rec.compare(i, j)
//   ・交換した直後に          rec.swap(i, j)
//   ・main() の最後で        rec.done()
//   （代入で1か所だけ書き換えたときは rec.write(i)、注目位置を示すだけなら rec.mark(i, ...)）
// 元のループ構造・変数名・出力は一切変えない。
//
// 読み込み順は  p5.min.js → viz.js → 各アルゴリズムの .js  （HTML の body 末尾で）

const VIZ_MAX_FRAMES = 20000; // 暴走防止（BogoSort など終わらないものがあるため）

// ---- 記録係 -------------------------------------------------------------
const VizRecorder = {
    a: [], N: 0, frames: [], out: '', nCompare: 0, nSwap: 0, full: false,

    init(s, N) {
        this.a = s;                 // 配列そのものを覚えておく（毎コマ写しを取る）
        this.N = N;
        this.frames = [];
        this.out = '';
        this.nCompare = 0;
        this.nSwap = 0;
        this.full = false;
        this.push('init', []);
    },
    compare(i, j) { this.nCompare++; this.push('compare', [i, j]); },
    swap(i, j) { this.nSwap++; this.push('swap', [i, j]); },
    write(i) { this.push('write', [i]); },
    mark() { this.push('mark', Array.prototype.slice.call(arguments)); },
    done() { this.push('done', []); },

    push(type, hi) {
        if (this.full) return;
        if (this.frames.length >= VIZ_MAX_FRAMES) { this.full = true; return; }
        const arr = [];
        for (let k = 0; k < this.N; k++) arr[k] = this.a[k];
        this.frames.push({
            type: type, hi: hi, arr: arr,
            outLen: this.out.length, nc: this.nCompare, ns: this.nSwap
        });
    },
};

// ---- 再生の状態 ---------------------------------------------------------
let vizFrames = [];
let vizIndex = 0;
let vizPlaying = false;
let vizAcc = 0;          // 1コマ未満の端数
let vizOut = '';
let vizShownLen = -1;    // いま出力欄に出している文字数

const VIZ_TYPE_NAME = {
    init: 'はじめの状態',
    compare: '比較',
    swap: '交換',
    write: '書き込み',
    mark: '注目',
    done: '完了',
};

function vizSpeed() {
    const el = document.getElementById('speed');
    return el ? Number(el.value) : 20;    // 1秒あたりの手数
}

function vizSetPlaying(b) {
    vizPlaying = b;
    const el = document.getElementById('btnPlay');
    if (el) el.textContent = b ? '一時停止' : '再生';
}

// アルゴリズムを走らせてトレースを作る
function vizBuild() {
    window._stdin = null;                          // 入力欄を最初から読み直す
    const savedPrint = window.print;               // 各 .js が定義している print()
    window.print = function (s) { VizRecorder.out += String(s); };
    try {
        main();                                    // 各アルゴリズムの main()
    } finally {
        window.print = savedPrint;
    }
    vizFrames = VizRecorder.frames;
    vizOut = VizRecorder.out;
    vizIndex = 0;
    vizAcc = 0;
    vizShownLen = -1;
    const out = document.getElementById('output');
    if (out) out.textContent = '';
}

// いまのコマまでの print() 出力を出力欄に反映する
function vizSyncOutput() {
    const f = vizFrames[vizIndex];
    const el = document.getElementById('output');
    if (!f || !el || f.outLen === vizShownLen) return;
    el.textContent = vizOut.slice(0, f.outLen);
    vizShownLen = f.outLen;
}

// ---- 描画 ---------------------------------------------------------------
function vizDrawFrame(p, f) {
    const N = f.arr.length;
    if (N === 0) return;

    let min = f.arr[0], max = f.arr[0];
    for (let k = 1; k < N; k++) {
        if (f.arr[k] < min) min = f.arr[k];
        if (f.arr[k] > max) max = f.arr[k];
    }

    const left = 20, right = p.width - 20, top = 70, bottom = p.height - 34;
    const w = (right - left) / N;
    const minH = 12;                               // 0や最小値でも見えるように下駄をはかせる
    const span = bottom - top - minH;

    p.noStroke();
    for (let k = 0; k < N; k++) {
        const h = (max === min) ? (minH + span) : (minH + (f.arr[k] - min) / (max - min) * span);

        if (f.type === 'done') p.fill(76, 175, 80);
        else if (f.hi.indexOf(k) >= 0) {
            if (f.type === 'swap') p.fill(224, 80, 80);
            else if (f.type === 'write') p.fill(120, 110, 200);
            else p.fill(240, 160, 48);
        } else p.fill(127, 159, 191);

        p.rect(left + k * w + 1, bottom - h, Math.max(w - 2, 1), h);

        if (N <= 30) {                             // 数が少ないときだけ値も書く
            p.fill(60);
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(12);
            p.text(f.arr[k], left + k * w + w / 2, bottom + 6);
        }
    }
}

function vizDrawStatus(p, f) {
    const title = (typeof VIZ_TITLE !== 'undefined') ? VIZ_TITLE : document.title;
    p.fill(30);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(17);
    p.text(title, 20, 16);
    p.fill(90);
    p.textSize(13);
    p.text('ステップ ' + vizIndex + ' / ' + (vizFrames.length - 1)
        + '　　比較 ' + f.nc + ' 回　交換 ' + f.ns + ' 回'
        + '　　← ' + (VIZ_TYPE_NAME[f.type] || f.type), 20, 42);
}

// ---- p5.js（インスタンスモード）----------------------------------------
// グローバルモードにすると p5 の print() と各 .js の print() がぶつかるため、
// 名前を汚さないインスタンスモードで使う。
new p5(function (p) {
    p.setup = function () {
        const c = p.createCanvas(760, 380);
        c.parent('canvas');
        p.frameRate(60);
    };

    p.draw = function () {
        p.background(255);

        if (vizFrames.length === 0) {
            p.fill(140);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.text('「実行」ボタンを押すと動きはじめます', p.width / 2, p.height / 2);
            return;
        }

        if (vizPlaying) {
            vizAcc += vizSpeed() / 60;
            while (vizAcc >= 1) {
                vizAcc -= 1;
                if (vizIndex < vizFrames.length - 1) vizIndex++;
                else { vizSetPlaying(false); vizAcc = 0; break; }
            }
        }

        vizSyncOutput();
        vizDrawFrame(p, vizFrames[vizIndex]);
        vizDrawStatus(p, vizFrames[vizIndex]);
    };
});

// ---- ボタンの割り当て ---------------------------------------------------
document.getElementById('btnRun').onclick = function () {
    vizBuild();
    vizSetPlaying(true);
};
document.getElementById('btnPlay').onclick = function () {
    if (vizFrames.length === 0) vizBuild();
    vizSetPlaying(!vizPlaying);
};
document.getElementById('btnStep').onclick = function () {
    if (vizFrames.length === 0) vizBuild();
    vizSetPlaying(false);
    if (vizIndex < vizFrames.length - 1) vizIndex++;
};
document.getElementById('btnHead').onclick = function () {
    vizSetPlaying(false);
    vizIndex = 0;
    vizAcc = 0;
    vizShownLen = -1;
};
// ==========================================================================
