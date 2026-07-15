// ====== 共通の入出力機能（変更しない）======
// Node.js・ブラウザ両対応の入出力
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
const isNode = (typeof window === 'undefined');

function print(s) {
    if (isNode) {
        process.stdout.write(String(s));
    } else {
        // appendChild(createTextNode) は追記のたびに全文をコピーしないため大量出力でも速い
        document.getElementById('output').appendChild(document.createTextNode(String(s)));
    }
}

function input(msg) {
    if (isNode) {
        print(msg);
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
    } else {
        // ページに入力欄（id="stdin"）があり値が入っていれば、そこから1行ずつ読む
        // （VSCode内蔵ブラウザなど prompt() のダイアログが出ない環境向け）
        const box = document.getElementById('stdin');
        if (box && box.value.trim() !== '') {
            if (!window._stdin) window._stdin = { lines: box.value.split('\n'), pos: 0 };
            const ans = (window._stdin.pos < window._stdin.lines.length)
                ? window._stdin.lines[window._stdin.pos++].trim() : '';
            print(msg + ans + "\n");                // 端末のエコーの代わりに出力欄にも残す
            return ans;
        }
        const ans = window.prompt(msg);
        print(msg + ans + "\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }
}
// ==========================================

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
		// 	print(s[k] + " ");
		// }
		// print("\n");
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
//			print(s[k] + " ");
//		}
//		print("\n");
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
//		print(h + " : ");
//		for (let x=0; x<N; x++) {
//			print(s[x] + " ");
//		}
//		print("\n");
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
//			print(s[k] + " ");
//		}
//		print("first= " + first + " last= " + last + "\n");

	if (first < last) {
		pivot = s[last];
//			print("Pivot=" + pivot + "\n");
		i = first;
		j = last - 1;
		while (true) {
			while ((i < last) && (s[i] < pivot)) {
				i += 1;
			}
			while ((j >= first) && (s[j] > pivot)) {
				j -= 1;
			}
//			print("i= " + i + "j= " + j + "\n");
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
//		print(s[k] + " ");
//	}
//	print(" Pivot=" + s[i] + " ");
//	for (let k=i+1; k<=last; k++) {
//		print(s[k] + " ");
//	}
//	print("\n");

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
// //		print(s[k] + " ");
// //	}
// //	print("\n");

	// print("BubbleSort Start!!\n");
	// bubbleSort(s, N);
	// print("BubbleSort End!!\n");
	// for (let k=0; k<N-1; k++) {
	// 	print(s[k] + " ");
	// }
	// print("\n");
	// for (let i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
	// print("SelectionSort Start!!\n");
	// selectionSort(s, N);
	// print("SelectionSort End!!\n");

	// for (let i = 0; i < N; i++) {
	// 	// s[i] = (rand() % 1000000);
	// 	s[i] = 1000000-i;
	// }
	// print("InsertionSort Start!!\n");
	// insertionSort(s, N);
	// print("InsertionSort End!!\n");

	for (let i = 0; i < N; i++) {
		// s[i] = (rand() % 1000000);
		s[i] = 1000000 - i;

	}
	print("ShellSort Start!!\n");
	shellSort(s, N);
	print("ShellSort End!!\n");

	// for (let i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
	// print("QuickSort Start!!\n");
	// quickSort(s, N);
	// print("QuickSort End!!\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
