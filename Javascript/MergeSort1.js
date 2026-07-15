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

function mergeSort(s, N) {
	let msize = 1, i, j, k, base1, base2;
	const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要

	while (msize < N) {
		k = 0;
		base1 = 0;
		base2 = msize;
		while (base1 < N) {
			i = j = 0;
			while (true) {
				if ((i < msize) && (j < msize) && (base1 + i < N) && (base2 + j < N)) {
					if (s[base1 + i] < s[base2 + j]) {
						b[k] = s[base1 + i];
						i++;
						k++;
					} else {
						b[k] = s[base2 + j];
						j++;
						k++;
					}
				} else if ((i < msize) && (base1 + i < N)) {
					b[k] = s[base1 + i];
					i++;
					k++;
				} else if ((j < msize) && (base2 + j < N)) {
					b[k] = s[base2 + j];
					j++;
					k++;
				} else {
					break;
				}
			}
			base1 += 2 * msize;
			base2 += 2 * msize;
		}
		for (i = 0; i < N; i++)
			s[i] = b[i];
		for (let p = 0; p < N; p++) {
			print(s[p] + " ");
		}
		print("msize= " + msize + "\n");
		// ================  0 =============
		msize *= 2;
	}
}

function main() {
	// const s = [4, 5, 2, 3, 7, 10, 8, 1, 9, 6, 0, -1, -2];
	const s = [4, 5, -2, 7, 3, 10, 8, 1, 6, 9, 0, -1, 2];
	// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
	const N = 13;
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");

	mergeSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
