function bubbleSort(s, N) {
    let temp;
    for (let i = 0; i < N - 1; i++) {
        for (let k = 0; k < N; k++) {
            process.stdout.write(s[k] + " ");
        }
        process.stdout.write("\n");
        for (let j = 0; j < N - 1; j++)
            if (s[j] > s[j + 1]) {
                temp = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp;
            }
    }
}

function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    const N = 9;
    // const s = [4, 5, 2, 8, 7, 1];
    // const N = 6;
    // const s = [5, 4, 8, 2, 7, 0, 1];
    // const N = 7;

    bubbleSort(s, N);
    for (let k = 0; k < N; k++) {
        process.stdout.write(s[k] + " ");
    }
    process.stdout.write("\n");
}

main();

//		const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
//	const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
// 100,-100,2];
