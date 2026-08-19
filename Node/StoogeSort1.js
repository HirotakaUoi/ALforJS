// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function stoogeSort(s, i, j) {
    if (s[i] > s[j]) {
        const temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }

    if (j - i + 1 > 2) {
        const t = Math.floor((j - i + 1) / 3);
        stoogeSort(s, i, j - t);
        stoogeSort(s, i + t, j);
        stoogeSort(s, i, j - t);
    }
}

async function main() {
    const s = [5, 4, 8, 2, 7, 0, 1];
    const N = 7;

    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");

    stoogeSort(s, 0, N - 1);

    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");
}

main().finally(close);
