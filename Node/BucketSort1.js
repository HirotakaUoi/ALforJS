// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function bucketSort(s) {
    const N = s.length;
    const max = 20;
    let i, j;
    const b = [];   // JSの配列は自動拡張されるため大きさの指定は不要

    for (j = 0; j <= max; j++)
        b[j] = 0;
    for (i = 0; i < N; i++)
        b[s[i]] += 1;
    for (const v of b) {
        output(v + " ");
    }
    output("Bucket \n");

    i = 0;
    for (j = 0; j <= max; j++)
        while (b[j] > 0) {
            s[i++] = j;
            b[j] -= 1;
        }
}

function main() {
    // const s = [4, 3, 1, 6, 5, 4, 2, 3, 0];   // max=6
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0];
    const s = [4, 15, 2, 7, 10, 8, 1, 20, 14, 9, 3, 0, 12, 0, 2, 10];

    bucketSort(s);
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
}

main();
