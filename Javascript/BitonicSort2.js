// ====== 共通の入力機能（変更しない）======
// Node.js・ブラウザ両対応の同期入力（C++の cin >> 相当）
// Node.jsでは標準入力から1行だけ読み、ブラウザでは入力ダイアログを出す
const input = (typeof window !== 'undefined')
    ? (msg) => window.prompt(msg)
    : (msg) => {
        process.stdout.write(msg);
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
    };
// ========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

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
				process.stdout.write("fb= " + fb + " sb= " + sb + " i= " + i + " i^(1<<sb)= " + (i ^ (1 << sb)));
				process.stdout.write(" (i>>fb)= " + (i >> fb) + " (i>>sb)= " + (i >> sb));
				if ((((i >> fb) & 1) ^ ((i >> sb) & 1))) {
						process.stdout.write(" C " + " s[i]= " + s[i] + " s[i^(1<<sb)]= "
						+ s[i ^ (1 << sb)] + " " + Number(((((i >> fb) & 1) ^ ((i >> sb) & 1)) && (s[i] < s[i ^ (1 << sb)])) ? 1 : 0));
				}
				process.stdout.write("\n");
				if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && (s[i] < s[i ^ (1 << sb)])) {
                    swap(s, i, i ^ (1 << sb));
                }
            }
        }
    }
}

function main() {
	const logArraySize = parseInt(input("Input array size by 2^N: "), 10);
// ( n<<N は nのN bit左シフト == n*(2^N))
	const s = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	const N = logArraySize;
	for (let i = 0; i < (1 << logArraySize); i++) {
		s[i] = (rand() % 100);
	}
	for (let k = 0; k < (1 << logArraySize); k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");

	bitonicSort(s, N);
	for (let k = 0; k < (1 << logArraySize); k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
}

main();
