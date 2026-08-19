// ====== 共通の入出力機能（ターミナル・Generator版・変更しない）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当。yield で一時停止し、ターミナルの入力欄からの値を待つ
//             （呼び出し側は yield* input(msg) の形で main() から呼ぶ）
const term = document.getElementById('terminal');

// プレイグラウンドは常にブラウザ実行。BigSort2 の clock() のように
// ソース本体に isNode の分岐が残っているものがあるので、ここで定義しておく
const isNode = false;

function print(s) {
    term.appendChild(document.createTextNode(String(s)));
    term.scrollTop = term.scrollHeight;
}

function* input(msg) {
    const line = yield msg;
    return line.trim();
}
// ==========================================

// ====== ここから下は実行用の駆動部（アルゴリズム本体ではない）======
const runBtn = document.getElementById('runBtn');
const resetBtn = document.getElementById('resetBtn');
let gen = null;
let waitingForInput = false;

// SleepSort1のような「setTimeoutを仕掛けたらすぐreturnする」プログラム対策：
// 実行(run)/リセットのたびに世代を進め、古い世代のタイマーが後から発火しても無視する
// （でないと、タイマーが残っている間に再実行すると出力が新旧混ざってしまう）
let runGeneration = 0;
// function宣言だと window.setTimeout 自体を上書きしてしまう（無限再帰の原因になる）ため、
// window.setTimeout には影響しない const の関数式にする。それでもeval後のコードからの
// 素の setTimeout(...) 呼び出しはこのローカル束縛を参照する（レキシカルスコープで解決されるため）
const setTimeout = (fn, delay, ...args) => {
    const scheduledGeneration = runGeneration;
    return window.setTimeout(() => {
        if (scheduledGeneration === runGeneration) fn(...args);
    }, delay, ...args);
};

function showInputLine(promptText, onSubmit) {
    print(promptText);
    const box = document.createElement('input');
    box.type = 'text';
    box.className = 'term-input';
    box.autocomplete = 'off';
    box.spellcheck = false;
    term.appendChild(box);
    box.focus();
    waitingForInput = true;
    box.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.stopPropagation();  // documentのEnterハンドラ（実行開始用）まで伝播させない
        const val = box.value;
        box.remove();
        waitingForInput = false;
        print(val + '\n');
        onSubmit(val);
    });
    term.scrollTop = term.scrollHeight;
}

function finishOk() {
    runBtn.disabled = false;
    resetBtn.disabled = true;
}

function finishWithError(label, message) {
    print('\n' + label + ': ' + message + '\n');
    finishOk();
}

// gen.next()の呼び出しはここに集約し、実行中の例外（編集した本体のバグ）を毎回捕まえる
function advance(val) {
    let res;
    try {
        res = gen.next(val);
    } catch (e) {
        finishWithError('実行時エラー', e.message);
        return;
    }
    step(res);
}

function step(res) {
    if (res.done) {
        finishOk();
        return;
    }
    showInputLine(res.value, (val) => advance(val));
}

// main() の種類ごとに駆動方法を変える：
// - function*  : input()で一時停止できるもの（gen.next()を刻んで進める）
// - async function : QuickSort1P/11P のような Promise.all を使う並列スレッド模擬（input()は呼ばない前提）
// - function（通常）: 入力なしでその場で完結するもの（SleepSort1のsetTimeoutもここに含む）
function kindOf(fn) {
    const name = fn.constructor.name;
    if (name === 'GeneratorFunction') return 'generator';
    if (name === 'AsyncFunction') return 'async';
    if (name === 'Function') return 'sync';
    return null;
}

function run() {
    try {
        eval(document.getElementById('source').value);  // main（と、それが使う関数群）を編集後の内容で再定義する
    } catch (e) {
        term.textContent = '構文エラー: ' + e.message + '\n';
        return;
    }
    const kind = typeof main === 'function' ? kindOf(main) : null;
    if (!kind) {
        term.textContent = 'main は function main() / async function main() / function* main() のいずれかにしてください\n';
        return;
    }

    runBtn.disabled = true;
    resetBtn.disabled = false;
    term.textContent = '';
    runGeneration++;  // 前回の実行で残っていたsetTimeoutを無効化する

    if (kind === 'generator') {
        gen = main();
        advance();
    } else if (kind === 'async') {
        main().then(finishOk, (e) => finishWithError('実行時エラー', e.message));
    } else {
        try {
            main();
            finishOk();
        } catch (e) {
            finishWithError('実行時エラー', e.message);
        }
    }
}

function reset() {
    runBtn.disabled = false;
    resetBtn.disabled = true;
    term.textContent = '';
    gen = null;
    runGeneration++;  // 残っていたsetTimeoutを無効化する
}

runBtn.addEventListener('click', run);
resetBtn.addEventListener('click', reset);

// 入力待ちの最中にターミナルの余白をクリックしたら、入力欄にフォーカスを戻す
// （フォーカスが外れるとEnterが効かなくなり、行き詰まって見えるため）
term.addEventListener('click', () => {
    if (!waitingForInput) return;
    const box = term.querySelector('.term-input');
    if (box) box.focus();
});

document.addEventListener('keydown', (e) => {
    // runBtn自体（ネイティブなEnter動作と二重発火するため）と
    // ソース編集欄（改行入力とかぶるため）ではEnter即実行を無効にする
    if (e.key === 'Enter' && !waitingForInput && !runBtn.disabled &&
        e.target !== runBtn && e.target.id !== 'source') {
        run();
    }
});

// ソースコード欄には、そのページのプログラム本体（print/input を除いた部分）を入れる
// （print/input は環境が提供するライブラリとして隠す）
document.getElementById('source').value =
    document.getElementById('source-text').textContent.replace(/^\n/, '').replace(/\s+$/, '') + '\n';
// ==============================================================
