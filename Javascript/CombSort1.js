function combSort(s, N) {
    let temp;
    let h = Math.floor(N * 10 / 13);
    let swapped;

    while (true) {
        if (h === 9 || h === 10) h = 11;
        swapped = false;
        for (let i = 0; i + h < N; i++) {
            if (s[i] > s[i + h]) {
                temp = s[i + h];
                s[i + h] = s[i];
                s[i] = temp;
                swapped = true;
            }
        }
        if (h === 1) {
            if (!swapped) break;
        } else {
            h = Math.floor(h * 10 / 13);
        }
        for (let k = 0; k < N; k++) {
            process.stdout.write(s[k] + " ");
        }
        process.stdout.write("\n");
    }
}

function main() {
    // const s = [4, 5, 8, 2, 7, 1];
    // const N = 6;
    const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    const N = 9;
    // const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1];
    // const N = 13;
    //	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
	// const N = 19;
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");

	combSort(s, N);
	for (let k = 0; k < N; k++) {
		process.stdout.write(s[k] + " ");
	}
	process.stdout.write("\n");
}

main();

//	const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
