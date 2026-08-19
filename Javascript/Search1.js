// ====== 共通の入出力機能 ======
const isNode = (typeof window === 'undefined');
const fs = isNode ? require('fs') : null;

function print(s) {
    if (isNode) process.stdout.write(String(s));
    else document.getElementById('output').append(String(s));
}

function input(msg) {
    if (isNode) {
        print(msg);
        const buf = Buffer.alloc(1);
        const bytes = [];
        while (fs.readSync(0, buf, 0, 1) && buf[0] !== 10) bytes.push(buf[0]);
        return Buffer.from(bytes).toString('utf-8').trim();
    }

    const box = document.getElementById('stdin');
    if (box && box.value.trim() !== '') {
        if (!window._stdin) window._stdin = { lines: box.value.split('\n'), pos: 0 };
        const ans = (window._stdin.lines[window._stdin.pos++] || '').trim();
        print(msg + ans + "\n");
        return ans;
    }

    const ans = window.prompt(msg);
    print(msg + ans + "\n");
    return ans;
}
// ==============================

function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0];
    const N = 8;    //配列の大きさをNという定数にする

    const d = parseInt(input("Input search number: "), 10);     //入力タイミングの提示

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            print("Found: " + d + " at index " + i + "\n");
            return;
        }
    }
    print("I can't find: " + d + "\n");     //少し丁寧な返事
}

if (isNode) main();     // ブラウザでは「実行」ボタンから main() を呼ぶ
