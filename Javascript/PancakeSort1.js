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

// リストの前からk+1個の要素を反転する関数
function flip(s, k) {
    for (let i = 0; i <= Math.floor(k / 2); i++) {
        const temp = s[i];
        s[i] = s[k - i];
        s[k - i] = temp;
    }
}

// Pancake Sortアルゴリズム
function pancakeSort(s, N) {
    for (let i = N; i > 1; --i) {
        // 最大要素のインデックスを探す
        let max_index = 0;
        for (let j = 1; j < i; ++j) {
            if (s[j] > s[max_index]) {
                max_index = j;
            }
        }

        // 最大要素が最後の位置にない場合に反転操作を行う
        if (max_index !== i - 1) {
            // 最大要素を先頭に持ってくる
            flip(s, max_index);
            for (let k = 0; k < N; k++) {
                print(s[k] + " ");
            }
            print("\n");

            // 最大要素を現在のサイズの最後に移動する
            flip(s, i - 1);
            for (let k = 0; k < N; k++) {
                print(s[k] + " ");
            }
            print("\n");
        }
    }
}

function main() {
    const s = [5, 4, 8, 2, 7, 0, 1];
    const N = 7;
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,
    // -100, 2]; const N = 19;

    pancakeSort(s, N);

    // ソート後のリストを表示
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");

    const t = [0, 1, 2, 3, 4, 5, 6];
    for (let t = 0; t < 7; t++) return;
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
