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

// C言語の srand()/rand() 相当（シード付き線形合同法）
let _seed = 1;
function srand(seed) { _seed = seed >>> 0; }
function rand() {
    _seed = (Math.imul(_seed, 1103515245) + 12345) >>> 0;
    return (_seed >>> 16) & 0x7fff;
}

function swap(s, i, j) {
	const temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

function bitonicsort(lgn, ary) {
    for (let fb = 1; fb <= lgn; fb++) {
        for (let sb = fb - 1; sb >= 0; sb--) {
            // this loop can be parallelized
            for (let i = 0; i < (1 << lgn); i++) {
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && ary[i] < ary[i ^ (1 << sb)]) {
                    swap(ary, i, i ^ (1 << sb));
                }
            }
        }
    }
}

function main() {
    srand(10000);
    const lgn = 10;
    const ary = [];	// JSの配列は自動拡張されるため大きさの指定は不要
    print(String(1 << lgn));
    for (let i = 0; i < (1 << lgn); i++) {
        ary[i] = rand() % 10000;
    }
    bitonicsort(lgn, ary);
    for (let i = 0; i < (1 << lgn); i++) {
        print(ary[i] + ", ");
    }
    print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
