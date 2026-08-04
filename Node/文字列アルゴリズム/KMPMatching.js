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

function makePartialMatchTable(pat) {
    // JSの配列は自動拡張されるため大きさの指定は不要
    // （C++のnew int[]と違い未設定の要素はundefinedになるので0で初期化しておく）
    const pmt = [];
    for (let k = 0; k < pat.length; k++) pmt[k] = 0;

    let j = 0;
    for (let i = 0; i < pat.length; i++) {
        if (i === 0) pmt[0] = -1;
        else if (i === 1) pmt[1] = 0;
        else if (pat[i - 1] === pat[j]) pmt[i] = ++j;
        else if (j > 0) j = pmt[j];
        else {
            pmt[i] = 0;
        }
    }
    return pmt;
}

function KMP(p, s) {
    let i, j;

    const pmt = makePartialMatchTable(p);
    for (let k = 0; k < p.length; k++) print(pmt[k] + " ");
    print("\n");
    print(p + "\n");
    print(s + "\n");

    i = 0;
    j = 0;
    while (i + j < s.length) {
        print("i=" + i + " i+j=" + (i + j) + " s[" + (i + j) + "]=" + s[i + j] + ", j=" + j + " p[" + j + "]=" + p[j] + " pmt[" + j + "]=" + pmt[j] + "\n");

        if (s[i + j] === p[j]) {
            j++;
            if (j === p.length) return i;
        } else {
            i = i + j - pmt[j];
            if (j > 0) j = pmt[j];
        }
    }
    return -1;
}

async function main() {
    let p, s;
    // Console.Write("Input pattern string: ");
    // p = Console.ReadLine();
    // Console.Write("Input string: ");
    // s = Console.ReadLine();
    // p = "ABCDABD";
    // s = "ABC ABCDAB ABCDABCDABDE";
    p = "aaaaaab";
    s = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab";
    const result = KMP(p, s);
    if (result === -1)
        print("Pattern not matched!\n");
    else
        print("Pattern matched! at " + result + "\n");
}

main().finally(() => rl.close());
