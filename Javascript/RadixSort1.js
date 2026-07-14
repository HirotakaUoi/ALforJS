function radixSort(s, N, max) {
    let i, j, k, n;

    // C++の vector<int> b[10] 相当：10個の空配列（配列リテラルで十分）
    const b = [[], [], [], [], [], [], [], [], [], []];

    for (n = 1; n < max; n *= 10) {
        for (i = 0; i < 10; i++) b[i].length = 0;

        for (i = 0; i < N; i++)
            b[Math.floor(s[i] / n) % 10].push(s[i]);

        for (k = 0; k < 10; k++) {
            process.stdout.write(k + ": ");
            for (i = 0; i < b[k].length; i++)
                process.stdout.write(String(b[k][i]).padStart(3, "0") + " ");
            process.stdout.write("\n");
        }
        k = 0;
        for (j = 0; j < 10; j++)
            for (i = 0; i < b[j].length; i++)
                s[k++] = b[j][i];
        for (k = 0; k < N; k++) {
            process.stdout.write(s[k] + " ");
        }
        process.stdout.write("\n");
    }
}

function main() {
    const s = [345, 98, 302, 719, 804, 620, 183, 431, 572];
    const N = 9;
    // const s = new Array(20);
    // const N = 20;
    // for (let i = 0; i < N; i++) {
    //     s[i] = (rand() % 1000);
    // }
    for (let k = 0; k < N; k++) {
        process.stdout.write(s[k] + " ");
    }
    process.stdout.write("\n");
    radixSort(s, N, 1000);
    for (let k = 0; k < N; k++) {
        process.stdout.write(s[k] + " ");
    }
    process.stdout.write("\n");
}

main();
