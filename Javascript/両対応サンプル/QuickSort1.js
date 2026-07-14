//====== 環境判定と入出力の吸収層（Node.js・ブラウザ両対応）======
const isNode = (typeof window === "undefined");

function print(s) {                      // cout << 相当（改行なし出力）
    if (isNode) {
        process.stdout.write(s);
    } else {
        document.getElementById("output").textContent += s;
    }
}
//==============================================================

function qsort(s, first, last) {
	let pivot, i, j, temp;

	if (first < last) {
		pivot = s[last];
		i = first;
		j = last - 1;
		while (true) {
			while ((i < last) && (s[i] < pivot)) {
				i += 1;
			}
			while ((j >= first) && (s[j] > pivot)) {
				j -= 1;
			}
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
		print(s[k] + " ");
	}
	print(" Pivot=" + s[i] + " ");
	for (let k = i + 1; k <= last; k++) {
		print(s[k] + " ");
	}
	print("\n");

		qsort(s, first, i - 1);
		qsort(s, i + 1, last);
	}
}

function quickSort(s, N) {
	qsort(s, 0, N - 1);
}


function main() {
	const s = [4, 5, 2, 11, 6, 10, 1, 9, 3, 0, -1, -2, 12];
	const N = 13;
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");

	quickSort(s, N);
	for (let k = 0; k < N; k++) {
		print(s[k] + " ");
	}
	print("\n");
}

main();
