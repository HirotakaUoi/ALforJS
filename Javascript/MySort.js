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

function qsort(s, first, last, b) {
	let i, j, k;

//	print("Merge  " + first + " " + last + "    ");
//	for (let q = first; q <= last; q++)
//		print(s[q] + " ");
//	print("\n");

	if (first < last) {
		const center = Math.floor((first + last) / 2);
		qsort(s, first, center, b);
		qsort(s, center + 1, last, b);

		for (i = first; i <= center; i++)
			b[i] = s[i];
		for (i = center + 1; i <= last; i++)
			b[last + center + 1 - i] = s[i];

		i = first;
		j = last;
		for (k = first; k <= last; k++)
			if (b[i] < b[j]) {
				s[k] = b[i];
				i++;
			} else {
				s[k] = b[j];
				j--;
			}
	}
}

function mySort(s, N) {
	const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	qsort(s, 0, N - 1, b);
}

function main() {
	const s = [4, 6, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
	const N = 13;

	mySort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
