function shellSort(s, N) {
	let temp, i, j, h;

	h = 1;
	while (h < N)
		h = 3 * h + 1;
	h = Math.floor((h - 1) / 3);

	while (h > 0) {
		process.stdout.write(h + " : ");
		for (let x = 0; x < N; x++) {
			process.stdout.write(s[x] + " ");
		}
		process.stdout.write("\n");
		for (i = h; i < N; i++) {
			for (let x = 0; x < N; x++) {
				process.stdout.write(s[x] + " ");
			}
			process.stdout.write("\n");
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

function main() {
	const s = [8, 3, 4, 1, 7, 6, 9, 5, 0];
	const N = 9;
	// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -2, -1, 6];
	// const N = 14;
	// const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
	// const N = 9;


	shellSort(s, N);
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
}

main();

//		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
