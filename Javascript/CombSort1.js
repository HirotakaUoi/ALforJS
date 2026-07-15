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

function combSort(s, N) {
    let temp;
    let h = Math.floor(N * 10 / 13);
    let swapped;

    while (true) {
        if (h === 9 || h === 10) h = 11;
        swapped = false;
        for (let i = 0; i + h < N; i++) {
            if (s[i] > s[i + h]) {
                temp = s[i + h];
                s[i + h] = s[i];
                s[i] = temp;
                swapped = true;
            }
        }
        if (h === 1) {
            if (!swapped) break;
        } else {
            h = Math.floor(h * 10 / 13);
        }
        for (let k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("\n");
    }
}

function main() {
    // const s = [4, 5, 8, 2, 7, 1];
    // const N = 6;
    const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    const N = 9;
    // const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1];
    // const N = 13;
    //	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
	// const N = 19;
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");

	combSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ

//	const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
