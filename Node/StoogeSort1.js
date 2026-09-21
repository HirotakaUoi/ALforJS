// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function stoogeSort(s, i, j) {
    if (s[i] > s[j]) {
        [s[i], s[j]] = [s[j], s[i]];
    }

    if (j - i + 1 > 2) {
        const t = Math.floor((j - i + 1) / 3);
        stoogeSort(s, i, j - t);
        stoogeSort(s, i + t, j);
        stoogeSort(s, i, j - t);
    }
}

function main() {
    const s = [5, 4, 8, 2, 7, 0, 1];
    const N = s.length;

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

main();
