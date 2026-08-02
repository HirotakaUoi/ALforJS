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

function fact(n) {
	if (n === 1) {
		return 1;
	} else {
		return n * fact(n - 1);
	}
}

async function main() {
	const n = parseInt(await input("Input number: "), 10);

	print(fact(n) + "\n");
}

main();
