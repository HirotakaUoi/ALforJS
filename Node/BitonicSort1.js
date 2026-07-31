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

function swap(s, i, j) {
	const temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

function bitonicSort(s, N) {
    for (let fb = 1; fb <= N; fb++) {
        for (let sb = fb - 1; sb >= 0; sb--) {
			// ここの繰り返しは並列実行可能!!
            for (let i = 0; i < (1 << N); i++) {
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && (s[i] < s[i ^ (1 << sb)])) {
//					swap(s, i, i^(1<<sb));
					const temp = s[i];
					s[i] = s[i ^ (1 << sb)];
					s[i ^ (1 << sb)] = temp;
                }
            }
        }
    }
}

function main() {
		const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1, 5, 7, 2];
//		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
	const N = 4;
// ( n<<N は nのN bit左シフト == n*(2^N))
	for (let k = 0; k < (1 << N); k++) {
		print(s[k] + " ");
	}
	print("\n");

	bitonicSort(s, N);
	for (let k = 0; k < (1 << N); k++) {
		print(s[k] + " ");
	}
	print("\n");
}

main();
