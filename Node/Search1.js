// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（readlineの非同期イテレータから1行受け取る。呼び出し側は await input(...)）
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const _lines = rl[Symbol.asyncIterator]();

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    print(msg);
    const { value } = await _lines.next();
    return (value ?? '').trim();
}
// ==========================================

async function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0];
    const N = 8;           //配列の大きさをNという定数にする

    const d = parseInt(await input("Input search number: "), 10);    //入力タイミングの提示

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            print("Found: " + d + " at index " + i + "\n");
            return;
        }
    }
    print("I can't find: " + d + "\n");  //少し丁寧な返事
}

main().finally(() => rl.close());
