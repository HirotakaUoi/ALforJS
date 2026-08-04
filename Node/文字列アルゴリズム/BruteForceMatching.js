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

function BruteForce(p, s) {
    let matched;
    for (let i = 0; i <= s.length - p.length; i++) {
        matched = true;
        for (let j = 0; j < p.length; j++) {
            print("s[" + (i + j) + "]=" + s[i + j] + ",  p[" + j + "]=" + p[j] + "\n");
            if (s[i + j] !== p[j]) {
                matched = false;
                break;
            }
        }
        if (matched) return i;
    }
    return -1;
}

async function main() {
    const p = await input("Input pattern string: ");
    const s = await input("Input string: ");
    print("0123456789012345678901234567890123456789\n");
    print(s + "\n");
    const result = BruteForce(p, s);
    if (result === -1)
        print("Pattern not matched!\n");
    else
        print("Pattern matched! at " + result + "\n");
}

main().finally(() => rl.close());
