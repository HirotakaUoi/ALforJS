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
    const s = [4, 5, 2, 8, 7, 1, 9, 0, 99999];  //配列の最後にとりあえず 99999 を置いておく
    const N = 8;  // 99999は除いた大きさ

    const d = parseInt(await input("Input search number: "), 10);
    s[N] = d;         //配列の最後(99999の位置)にdを置く

    let i = 0;
    while (s[i] !== d) i++;
    if (i === N) {     //iが配列の最後を指していたら…
        print("I can't find: " + d + "\n");
    } else {
        print("Found: " + d + " at index " + i + "\n");
    }
}

main().finally(() => rl.close());
