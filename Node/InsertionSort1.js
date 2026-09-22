// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function insertionSort(s) {
    const N = s.length;
    let j;

    for (let i = 0; i < N - 1; i++) {
        for (const v of s) {
            output(v + " ");
        }
        output("\n");
        j = i + 1;
        while ((j > 0) && (s[j - 1] > s[j])) {
            [s[j], s[j - 1]] = [s[j - 1], s[j]];
            j--;
        }
    }
}

function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];

    insertionSort(s);
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
}




// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];

main();
