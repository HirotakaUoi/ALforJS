// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（内部で readline の Promise を await して返す。呼び出し側は await input(...)）
const readline = require('readline/promises');

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const line = await rl.question(msg);
    rl.close();
    return line.trim();
}
// ==========================================

// ずらし表の作成
function CreateTable(pattern, table) {
    const patternLength = pattern.length;
    for (let i = 0; i < 256; i++) {
        table[i] = patternLength; // 初期化（デフォルトでパターンの長さに設定）
    }
    for (let i = 0; i < patternLength; i++) {
        table[pattern.charCodeAt(i)] = patternLength - i - 1;
    }
}

// Boyer-Moore-Horspool法による文字列検索
function BMHSearch(target, pattern) {
    const table = [];	// JSの配列は自動拡張されるため大きさの指定は不要（CreateTableが256要素すべてを埋める）
    CreateTable(pattern, table);

    // 開始位置をパターン末尾に合わせる
    let i = pattern.length - 1;
    let p = 0;

    while (i < target.length) {
        // パターン末尾に位置を合わせる
        p = pattern.length - 1;

        while (p >= 0 && i < target.length) {
            if (target[i] === pattern[p]) {
                i--;
                p--;
            } else {
                break;
            }
        }
        // 一致判定
        if (p < 0) return i + 1;

        // 不一致の場合、ずらし表を参照し i を進める
        // ただし、今比較した位置より後の位置とする
        const shift1 = table[pattern.charCodeAt(p)];
        const shift2 = pattern.length - p; // 比較を開始した地点の1つ後ろの文字
        i += Math.max(shift1, shift2);
    }

    return -1; // 見つからなかった
}

async function main() {
    const p = await input("Input pattern string: ");
    const s = await input("Input string: ");
    const result = BMHSearch(s, p);
    if (result === -1)
        print("Pattern not matched!\n");
    else
        print("Pattern matched! at " + result + "\n");
}

main();
