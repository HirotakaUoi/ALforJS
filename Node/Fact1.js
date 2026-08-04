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

main().finally(() => rl.close());
