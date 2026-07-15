// ====== 共通の入出力機能（変更しない）======
// Node.js・ブラウザ両対応の入出力
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
const isNode = (typeof window === 'undefined');

function print(s) {
    if (isNode) {
        process.stdout.write(String(s));
    } else {
        // appendChild(createTextNode) は追記のたびに全文をコピーしないため大量出力でも速い
        document.getElementById('output').appendChild(document.createTextNode(String(s)));
    }
}

function input(msg) {
    if (isNode) {
        print(msg);
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
    } else {
        // ページに入力欄（id="stdin"）があり値が入っていれば、そこから1行ずつ読む
        // （VSCode内蔵ブラウザなど prompt() のダイアログが出ない環境向け）
        const box = document.getElementById('stdin');
        if (box && box.value.trim() !== '') {
            if (!window._stdin) window._stdin = { lines: box.value.split('\n'), pos: 0 };
            const ans = (window._stdin.pos < window._stdin.lines.length)
                ? window._stdin.lines[window._stdin.pos++].trim() : '';
            print(msg + ans + "\n");                // 端末のエコーの代わりに出力欄にも残す
            return ans;
        }
        const ans = window.prompt(msg);
        print(msg + ans + "\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }
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

function main() {
    const p = input("Input pattern string: ");
    const s = input("Input string: ");
    const result = BMHSearch(s, p);
    if (result === -1)
        print("Pattern not matched!\n");
    else
        print("Pattern matched! at " + result + "\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
