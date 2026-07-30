// ====== 共通の入出力機能（Node.js専用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
function print(s) {
    process.stdout.write(String(s));
}

function input(msg) {
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
}
// ==========================================

function merge(s, first, last, b) {
	let i, j, k;

	print("Merge  " + first + " " + last + "    ");
	for (let q = first; q <= last; q++)
		print(s[q] + " ");
	print("\n");

	if (first < last) {
		const center = Math.floor((first + last) / 2);
		merge(s, first, center, b);
		merge(s, center + 1, last, b);

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
	print("Merged " + first + " " + last + "    ");
	for (let q = first; q <= last; q++)
		print(s[q] + " ");
	print("\n");

}

function mergeSort(s, N) {
	const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	merge(s, 0, N - 1, b);
}

function main() {
	const s = [4, 5, 2, 3, 7, 10, 8, 1, 9, 6, 0, -1, -2];
//		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
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

main();
