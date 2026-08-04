// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（readlineの非同期イテレータから1行受け取る。呼び出し側は await input(...)）
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const _lines = rl[Symbol.asyncIterator]();

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    print(msg);
    const { value } = await _lines.next();
    return (value ?? '').trim();
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

async function main() {
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

main().finally(() => rl.close());
