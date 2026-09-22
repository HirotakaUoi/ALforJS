// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function selectionSort(s) {
    const N = s.length;
    let min;
    for (let i = 0; i < N - 1; i++) {
        for (const v of s) {
            output(v + " ");
        }
        output("\n");
        min = i;
        for (let j = i + 1; j < N; j++) {
            if (s[min] > s[j]) {
                min = j;
            }
        }
        [s[i], s[min]] = [s[min], s[i]];
    }

}

function main() {
    const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0,];
    // // const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
    // const s = [4, 5, 2, 8, 7, 1];
    // const s = [5, 4, 8, 2, 7, 0, 1];

    selectionSort(s);
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
}

main();
