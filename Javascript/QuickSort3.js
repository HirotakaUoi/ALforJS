function rand() { return Math.floor(Math.random() * 2147483648); }

function qsort(s, first, last) {
	let pivot, i, j, temp, piv;

	for (let k = first; k <= last; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("first= " + first + " last= " + last + "\n");

	if (first < last) {
		if ((last - first) > 2) {
			piv = first + (rand() % (last - first + 1));
			temp = s[piv];
			s[piv] = s[last];
			s[last] = temp;
		}
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

	// for (let k=first; k<i; k++) {
	// 	process.stdout.write(s[k] + " ");
	// }
	// process.stdout.write(" Pivot=" + s[i] + " ");
	// for (let k=i+1; k<=last; k++) {
	// 	process.stdout.write(s[k] + " ");
	// }
	// process.stdout.write("\n");

		qsort(s, first, i - 1);
		qsort(s, i + 1, last);
	}
}

function quickSort(s, N) {
	qsort(s, 0, N - 1);
}


function main() {
		// const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1];  （元のC++では二重定義のためコメント化）
//		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
	const s = [4, 5, 2, 11, 6, 10, 1, 9, 3, 0, -1, -2, 12];
	const N = 13;
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");

	quickSort(s, N);
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
}

main();
