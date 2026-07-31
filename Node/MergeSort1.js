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

main();
