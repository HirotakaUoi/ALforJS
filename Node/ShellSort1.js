// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（内部で readline の Promise を await して返す。呼び出し側は await input(...)）
const readline = require('readline/promises');

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const line = await rl.question(msg);
    rl.close();
    return line.trim();
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
