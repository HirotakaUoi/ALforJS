function bucketSort(s, N) {
	const max = 20;
	let i, j;
	const b = [];	// JSの配列は自動拡張されるため大きさの指定は不要

	for (j = 0; j <= max; j++)
		b[j] = 0;
	for (i = 0; i < N; i++)
		b[s[i]] += 1;
	for (let k = 0; k <= max; k++) {
		process.stdout.write(b[k] + " ");
	}
	process.stdout.write("Bucket \n");

	i = 0;
	for (j = 0; j <= max; j++)
	while (b[j] > 0) {
		s[i++] = j;
		b[j] -= 1;
	}
}

function main() {
	// const s = [4, 3, 1, 6, 5, 4, 2, 3, 0];   // max=6
	//		const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0];
	const s = [4, 15, 2, 7, 10, 8, 1, 20, 14, 9, 3, 0, 12, 0, 2, 10];
	const N = 16;

	bucketSort(s, N);
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
	// console.log();
}

main();
