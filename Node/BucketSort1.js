// ====== 共通の入出力機能（Node.js専用・ASCII入力前提）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
function print(s) {
    process.stdout.write(String(s));
}

function input(msg) {
    print(msg);
    const fs = require('fs');
    const buf = Buffer.alloc(1);
    let line = '';
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
        line += String.fromCharCode(buf[0]);
    }
    return line.trim();
}
// ==========================================

function bucketSort(s, N) {
	const max = 20;
	let i, j;
	const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要

	for (j = 0; j <= max; j++)
		b[j] = 0;
	for (i = 0; i < N; i++)
		b[s[i]] += 1;
	for (let k = 0; k <= max; k++) {
		print(b[k] + " ");
	}
	print("Bucket \n");

	i = 0;
	for (j = 0; j <= max; j++)
	while (b[j] > 0) {
		s[i++] = j;
		b[j] -= 1;
	}
}

function main() {
	// const s = [4, 3, 1, 6, 5, 4, 2, 3, 0];   // max=6
	//		const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0];
	const s = [4, 15, 2, 7, 10, 8, 1, 20, 14, 9, 3, 0, 12, 0, 2, 10];
	const N = 16;

	bucketSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
	// console.log();
}

main();
