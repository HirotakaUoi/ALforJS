// ====== 共通の入力機能（変更しない）======
// Node.js・ブラウザ両対応の同期入力（C++の cin >> 相当）
// Node.jsでは標準入力から1行だけ読み、ブラウザでは入力ダイアログを出す
const input = (typeof window !== 'undefined')
    ? (msg) => window.prompt(msg)
    : (msg) => {
        process.stdout.write(msg);
        const fs = require('fs');
        const buf = Buffer.alloc(1);
        const bytes = [];
        while (true) {
            let n;
            try {
                n = fs.readSync(0, buf, 0, 1);      // 1バイトずつ読む
            } catch (e) {
                if (e.code === 'EAGAIN') continue;  // パイプでまだデータが来ていない間は待つ
                throw e;
            }
            if (n === 0) break;                     // EOF
            if (buf[0] === 10) break;               // '\n' が来たら1行の終わり
            bytes.push(buf[0]);
        }
        return Buffer.from(bytes).toString('utf-8').trim();
    };
// ========================================

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

function main() {
    const p = input("Input pattern string: ");
    const s = input("Input string: ");
    const result = BMHSearch(s, p);
    if (result === -1)
        process.stdout.write("Pattern not matched!\n");
    else
        process.stdout.write("Pattern matched! at " + result + "\n");
}

main();
