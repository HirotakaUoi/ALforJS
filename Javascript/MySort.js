function qsort(s, first, last, b) {
	let i, j, k;

//	process.stdout.write("Merge  " + first + " " + last + "    ");
//	for (let q = first; q <= last; q++)
//		process.stdout.write(s[q] + " ");
//	process.stdout.write("\n");

	if (first < last) {
		const center = Math.floor((first + last) / 2);
		qsort(s, first, center, b);
		qsort(s, center + 1, last, b);

		for (i = first; i <= center; i++)
			b[i] = s[i];
		for (i = center + 1; i <= last; i++)
			b[last + center + 1 - i] = s[i];

		i = first;
		j = last;
		for (k = first; k <= last; k++)
			if (b[i] < b[j]) {
				s[k] = b[i];
				i++;
			} else {
				s[k] = b[j];
				j--;
			}
	}
}

function mySort(s, N) {
	const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要
	qsort(s, 0, N - 1, b);
}

function main() {
	const s = [4, 6, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
	const N = 13;

	mySort(s, N);
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
}

main();
