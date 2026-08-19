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

// ====== 可視化の記録係（p5版共通・変更しない）======
// ブラウザ（p5ページ）では viz.js の VizRecorder を使う。
// node で直接動かしたときは「何もしない記録係」になるので、
// node Javascript/p5/BubbleSort1.js でも元の BubbleSort1 と同じ出力が得られる。
const rec = (typeof VizRecorder !== 'undefined') ? VizRecorder
    : { init() { }, compare() { }, swap() { }, write() { }, mark() { }, done() { } };
const VIZ_TITLE = 'BubbleSort1 ― バブルソート';
// ==================================================

function bubbleSort(s, N) {
	let temp;
	for (let i = 0; i < N - 1; i++) {
		for (let k = 0; k < N; k++) {
			print(s[k] + " ");
		}
		print("\n");
		for (let j = 0; j < N - 1; j++) {
			rec.compare(j, j + 1);                  // ★可視化用に足した行
			if (s[j] > s[j + 1]) {
				temp = s[j];
				s[j] = s[j + 1];
				s[j + 1] = temp;
				rec.swap(j, j + 1);                 // ★可視化用に足した行
			}
		}
	}
}

function main() {
	const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
	const N = 9;
	// const s = [4, 5, 2, 8, 7, 1];
	// const N = 6;
	// const s = [5, 4, 8, 2, 7, 0, 1];
	// const N = 7;

	rec.init(s, N);                                 // ★可視化用に足した行
	bubbleSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
	rec.done();                                     // ★可視化用に足した行
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
