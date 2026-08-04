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

function combSort(s, N) {
    let temp;
    let h = Math.floor(N * 10 / 13);
    let swapped;

    while (true) {
        if (h === 9 || h === 10) h = 11;
        swapped = false;
        for (let i = 0; i + h < N; i++) {
            if (s[i] > s[i + h]) {
                temp = s[i + h];
                s[i + h] = s[i];
                s[i] = temp;
                swapped = true;
            }
        }
        if (h === 1) {
            if (!swapped) break;
        } else {
            h = Math.floor(h * 10 / 13);
        }
        for (let k = 0; k < N; k++) {
            print(s[k] + " ");
        }
        print("\n");
    }
}

async function main() {
    // const s = [4, 5, 8, 2, 7, 1];
    // const N = 6;
    const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    const N = 9;
    // const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1];
    // const N = 13;
    //	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
	// const N = 19;
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");

	combSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

main().finally(() => rl.close());

//	const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
