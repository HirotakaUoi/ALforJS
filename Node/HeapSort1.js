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

async function main() {
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

main().finally(() => rl.close());
