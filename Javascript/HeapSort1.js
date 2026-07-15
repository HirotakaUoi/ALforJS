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

function swap(s, i, j) {
	const temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

function insertHeap(s, i) {
	while ((i > 0) && (s[i] > s[Math.floor((i - 1) / 2)])) {
		swap(s, i, Math.floor((i - 1) / 2));
		i = Math.floor((i - 1) / 2);
	}
}

function rebuildHeap(s, max) {
	let i = 0;

	while (true) {
		if (i * 2 + 2 < max) {
			if (s[i * 2 + 1] > s[i * 2 + 2]) {
				if (s[i * 2 + 1] > s[i]) {
					swap(s, i, i * 2 + 1);
					i = i * 2 + 1;
				} else {
					break;
				}
			} else {
				if (s[i * 2 + 2] > s[i]) {
					swap(s, i, i * 2 + 2);
					i = i * 2 + 2;
				} else {
					break;
				}
			}
		 } else if (i * 2 + 1 < max) {
			 if (s[i * 2 + 1] > s[i]) {
				swap(s, i, i * 2 + 1);
				i = i * 2 + 1;
			} else {
				break;
			}
		} else {
			break;
		}
	}
}

function heapSort(s, N) {
	let i;
	for (i = 1; i < N; i++) {
		insertHeap(s, i);
		for (let k = 0; k < N; k++) {
			print(s[k] + " ");
		}
		print("\n");
	}

	for (i = 0; i < N - 1; i++) {
		swap(s, 0, N - 1 - i);
		rebuildHeap(s, N - 1 - i);
		for (let k = 0; k < N; k++) {
			print(s[k] + " ");
		}
		print("\n");
	}
}

function main() {
	// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
	const s = [4, 5, 2, 8, 7, 10, 1, 11, 6, 3, 9, 12, -2];
		// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
	const N = 13;

	heapSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
