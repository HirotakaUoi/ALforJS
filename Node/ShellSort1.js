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

function shellSort(s, N) {
	let temp, i, j, h;

	h = 1;
	while (h < N)
		h = 3 * h + 1;
	h = Math.floor((h - 1) / 3);

	while (h > 0) {
		print(h + " : ");
		for (let x = 0; x < N; x++) {
			print(s[x] + " ");
		}
		print("\n");
		for (i = h; i < N; i++) {
			for (let x = 0; x < N; x++) {
				print(s[x] + " ");
			}
			print("\n");
			j = i;
			while ((j >= h) && (s[j - h] > s[j])) {
				temp = s[j];
				s[j] = s[j - h];
				s[j - h] = temp;
				j -= h;
			}
		}
		h = Math.floor((h - 1) / 3);
	}
}

function main() {
	const s = [8, 3, 4, 1, 7, 6, 9, 5, 0];
	const N = 9;
	// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -2, -1, 6];
	// const N = 14;
	// const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
	// const N = 9;


	shellSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

main();

//		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
