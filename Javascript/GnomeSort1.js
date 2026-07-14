function gnomeSort(s, N) {
    let i = 0;
    while (i < N) {
        for (let k = 0; k < N; k++) {
            process.stdout.write(s[k] + " ");
        }
        process.stdout.write("\n");

        if (i === 0 || s[i - 1] <= s[i]) {
            i++;
        } else {
            const temp = s[i];
            s[i] = s[i - 1];
            s[i - 1] = temp;
            i--;
        }
    }
}

function main() {
    // const s = [5, 4, 8, 2, 7, 0, 1];
    // const N = 7;
    const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100, -100, 2];
    const N = 19;

    gnomeSort(s, N);
    for (let k = 0; k < N; k++) {
        process.stdout.write(s[k] + " ");
    }
    process.stdout.write("\n");
}

main();
