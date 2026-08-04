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

async function main() {

    const s = [0, 1, 2, 4, 5, 7, 8, 9];
	const N = 8;
    let i;

    const d = parseInt(await input("Input search number: "), 10);

    for (i = 0; i < N; i++) {
		if (d <= s[i])
			break;
	}

	if ((i < N) && (d === s[i])) {		// dが見つかったなら…
        print("Found: " + d + " at index " + i + "\n");
    } else {
		print("I can't find: " + d + "\n");
	}
}

main().finally(() => rl.close());
