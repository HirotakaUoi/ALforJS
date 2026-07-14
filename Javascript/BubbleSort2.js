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

function rand() { return Math.floor(Math.random() * 2147483648); }

function bubbleSort(s, N) {
	let temp;
	for (let i = 0; i < N - 1; i++)
		for (let j = 0; j < N - 1; j++)
			if (s[j] > s[j + 1]) {
				temp = s[j];
				s[j] = s[j + 1];
				s[j + 1] = temp;
			}
}

function main() {
	const arraySize = parseInt(input("Input array size: "), 10);
	const s = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	const N = arraySize;
	for (let i = 0; i < N; i++) {
		s[i] = (rand() % 10000);
	}
	for (let k = 0; k < N - 1; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");

	bubbleSort(s, N);
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
}

main();
