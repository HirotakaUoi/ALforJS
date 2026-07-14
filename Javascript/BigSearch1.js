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

function qsort(s, first, last) {
	let pivot, i, j, temp;

//		for (let k=first; k<=last; k++) {
//			process.stdout.write(s[k] + " ");
//		}
//		process.stdout.write("first= " + first + " last= " + last + "\n");

	if (first < last) {
		pivot = s[last];
//			process.stdout.write("Pivot=" + pivot + "\n");
		i = first;
		j = last - 1;
		while (true) {
			while ((i < last) && (s[i] < pivot)) {
				i += 1;
			}
			while ((j >= first) && (s[j] > pivot)) {
				j -= 1;
			}
//			process.stdout.write("i= " + i + "j= " + j + "\n");
			if (i >= j) {
				break;
			}
			temp = s[i];
			s[i] = s[j];
			s[j] = temp;
			i += 1;
			j -= 1;
		}
		temp = s[i];
		s[i] = s[last];
		s[last] = temp;

	for (let k = first; k < i; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write(" Pivot=" + s[i] + " ");
	for (let k = i + 1; k <= last; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");

		qsort(s, first, i - 1);
		qsort(s, i + 1, last);
	}
}

function quickSort(s, N) {
	qsort(s, 0, N - 1);
}

function search1(s, N, d) {
    for (let i = 0; i < N; i++) {
      if (d === s[i]) {
        process.stdout.write("Found: " + d + " at index " + i + "\n");
        return 0;
      }
    }
	process.stdout.write("I can't find: " + d + "\n");
	return 0;
}

function bsearch1(s, N, d) {
	let i, first, last, center;
	first = 0;
	last = N - 1;
	while (first <= last) {					// 探索範囲が空でない間
		center = Math.floor((first + last) / 2);	// 範囲の真ん中を計算
		if (d === s[center]) {			// 範囲の真ん中の値がｄと等しい
			process.stdout.write("Found: " + d + " at index " + center + "\n");
			return 0;
		} else if (d < s[center]) {		// 範囲の真ん中の値がｄより大きい
			last = center - 1;			// 範囲の後半分を省く
		} else {							// 範囲の真ん中の値がｄより小さい
			first = center + 1; 			// 範囲の前半分を省く
		}
	}
	process.stdout.write("I can't find: " + d + "\n");
	return 0;
}


function main() {
	const arraySize = parseInt(input("Input array size: "), 10);
	const s = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	const N = arraySize;
	for (let i = 0; i < N; i++) {
		s[i] = (rand() % 100000);
	}
	quickSort(s, N);
	for (let k = 0; k < N - 1; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");

	const d = parseInt(input("Input search number: "), 10);

	search1(s, N, d);
	bsearch1(s, N, d);
}

main();
