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

function bubbleSort(s, N) {
	let temp;

	for (let i = 0; i < N - 1; i++)
		for (let j = 0; j < N - 1; j++)
			if (s[j] > s[j + 1]) {
				temp = s[j];
				s[j] = s[j + 1];
				s[j + 1] = temp;
			}
}

function selectionSort(s, N) {
	let min, temp;
	for (let i = 0; i < N - 1; i++) {
		// for (let k=0; k<N; k++) {
		// 	process.stdout.write(s[k] + " ");
		// }
		// process.stdout.write("\n");
		min = i;
		for (let j = i + 1; j < N; j++)
			if (s[min] > s[j])
				min = j;
		temp = s[i];
		s[i] = s[min];
		s[min] = temp;
	}
}

function insertionSort(s, N) {
	let j, temp;
	for (let i = 0; i < N - 1; i++) {
//		for (let k=0; k<N; k++) {
//			process.stdout.write(s[k] + " ");
//		}
//		process.stdout.write("\n");
		j = i + 1;
		while ((j > 0) && (s[j - 1] > s[j])) {
			temp = s[j];
			s[j] = s[j - 1];
			s[j - 1] = temp;
			j--;
		}
	}
}

function shellSort(s, N) {
	let temp, i, j, h;

	h = 1;
	while (h < N)
		h = 3 * h + 1;
	h = Math.floor((h - 1) / 3);

	while (h > 0) {
//		process.stdout.write(h + " : ");
//		for (let x=0; x<N; x++) {
//			process.stdout.write(s[x] + " ");
//		}
//		process.stdout.write("\n");
		for (i = h; i < N; i++) {
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

//	for (let k=first; k<i; k++) {
//		process.stdout.write(s[k] + " ");
//	}
//	process.stdout.write(" Pivot=" + s[i] + " ");
//	for (let k=i+1; k<=last; k++) {
//		process.stdout.write(s[k] + " ");
//	}
//	process.stdout.write("\n");

		qsort(s, first, i - 1);
		qsort(s, i + 1, last);
	}
}

function quickSort(s, N) {
	qsort(s, 0, N - 1);
}

function main() {
	const arraySize = parseInt(input("Input array size: "), 10);
	const s = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	const N = arraySize;
	// for (let i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
// //	for (let k=0; k<N; k++) {
// //		process.stdout.write(s[k] + " ");
// //	}
// //	process.stdout.write("\n");

	// process.stdout.write("BubbleSort Start!!\n");
	// bubbleSort(s, N);
	// process.stdout.write("BubbleSort End!!\n");
	// for (let k=0; k<N-1; k++) {
	// 	process.stdout.write(s[k] + " ");
	// }
	// process.stdout.write("\n");
	// for (let i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
	// process.stdout.write("SelectionSort Start!!\n");
	// selectionSort(s, N);
	// process.stdout.write("SelectionSort End!!\n");

	// for (let i = 0; i < N; i++) {
	// 	// s[i] = (rand() % 1000000);
	// 	s[i] = 1000000-i;
	// }
	// process.stdout.write("InsertionSort Start!!\n");
	// insertionSort(s, N);
	// process.stdout.write("InsertionSort End!!\n");

	for (let i = 0; i < N; i++) {
		// s[i] = (rand() % 1000000);
		s[i] = 1000000 - i;

	}
	process.stdout.write("ShellSort Start!!\n");
	shellSort(s, N);
	process.stdout.write("ShellSort End!!\n");

	// for (let i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
	// process.stdout.write("QuickSort Start!!\n");
	// quickSort(s, N);
	// process.stdout.write("QuickSort End!!\n");
}

main();
