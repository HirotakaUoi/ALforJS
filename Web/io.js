// ====== 共通の入出力機能（ブラウザ実行環境・変更しない）======
// Node/io.js のブラウザ版。output / input / close を
// グローバルに用意するので、プログラム側の書き方は Node 版とまったく同じになる。
//
//   output(s)   : C++の cout << 相当（改行なし出力）
//   input(msg) : C++の cin >> 相当（呼び出し側は await input(...)）
//   close()    : Node版と形を合わせるためのもの。ブラウザでは何もしない
//
// 時間計測は Node にもブラウザにもある performance.now() をそのまま使うので、ここでは用意しない
//
// この関数の中身は、実行のたびに文字列化されて iframe の中へ送り込まれる。
// 出力や入力要求は postMessage で実行環境（親ページ）とやりとりする。
function ioLibrary() {
    // 読み込めたことを実行環境に知らせる（応答が無ければ環境側が異常を検知する）
    parent.postMessage({ type: 'ready' }, '*');

    // output は1文字ずつ来ることもあるので、いったん溜めてからまとめて送る
    // （大量出力のプログラムで postMessage が詰まらないように）
    var buf = '';
    var timer = null;
    function flush() {
        if (buf) { parent.postMessage({ type: 'out', text: buf }, '*'); buf = ''; }
        timer = null;
    }

    function myOutput(s) {
        // 動作ハイライト中は、出力も行と同じ並びに記録して後から再生する
        if (window.__traceOn) { trace.push(String(s)); return; }
        buf += String(s);
        if (!timer) timer = setTimeout(flush, 16);
    }

    function myInput(msg) {
        myOutput(msg);
        flush();                                  // プロンプトを先に出しきる
        if (window.__flushTrace) window.__flushTrace();
        parent.postMessage({ type: 'input' }, '*');
        return new Promise(function (resolve) { window.__resolveInput = resolve; });
    }

    // 出力の名前を print ではなく output にしてあるのは、p5.js が読み込まれるときに
    // グローバルの print を自分のもの（console.log の別名）で上書きしてしまうため。
    // output は p5 も window も使っていないので、取り合いにならない
    window.output = myOutput;
    window.input = myInput;
    window.close = function () { };               // Node版と形を合わせるだけ

    window.addEventListener('message', function (e) {
        if (e.data && e.data.type === 'input-response' && window.__resolveInput) {
            var r = window.__resolveInput;
            window.__resolveInput = null;
            r(e.data.value);
        }
    });

    // ---- 動作ハイライト ----
    // JavaScript は単一スレッドなので、同期的なループが回っている間はタイマーも
    // postMessage も動けない。つまり「実行中に今の行を送る」ことは原理的にできない。
    // そこで実行中は行と出力を記録だけしておき、実行環境（親）が後から再生する。
    //
    // trace には数値（行番号）と文字列（出力）が混ざって入る。区別は型でつく。
    var trace = [];
    var TRACE_LIMIT = 20000;                      // 長すぎる記録は打ち切る

    window.__L = function (n) {
        if (!window.__traceOn) return;
        if (trace.length >= TRACE_LIMIT) { stopTrace(); return; }
        trace.push(n);
    };

    function stopTrace() {
        window.__traceOn = false;
        flushTrace();
        parent.postMessage({ type: 'traceoff' }, '*');
    }

    function flushTrace() {
        if (trace.length) { parent.postMessage({ type: 'trace', items: trace }, '*'); trace = []; }
    }
    window.__flushTrace = flushTrace;

    // p5 のスケッチは draw() が回り続け、終わりが来ない。
    // また setup() は実行環境の起動処理より後に呼ばれるので、
    // 記録は定期的にも送っておく（同期的なループの最中はどのみち動けない）
    if (window.__traceOn) setInterval(flushTrace, 200);

    window.__reportError = function (m) {
        flush();
        flushTrace();
        parent.postMessage({ type: 'error', message: String(m) }, '*');
    };
    window.onerror = function (msg) { window.__reportError(msg); return true; };
    window.addEventListener('unhandledrejection', function (e) {
        window.__reportError((e.reason && e.reason.message) || e.reason);
    });

    // <canvas> が作られたら実行環境に知らせる（p5 でも素の canvas でも拾える）
    new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
            var added = records[i].addedNodes;
            for (var j = 0; j < added.length; j++) {
                var n = added[j];
                if (n.nodeType === 1 && (n.tagName === 'CANVAS' || (n.querySelector && n.querySelector('canvas')))) {
                    parent.postMessage({ type: 'canvas' }, '*');
                    return;
                }
            }
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    window.__finish = function (isSketch) {
        flush();
        flushTrace();
        parent.postMessage({ type: 'done', sketch: !!isSketch }, '*');
    };
}
