// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function shellSort(s) {
    const N = s.length;
    let i, j, h;

    h = 1;
    while (h < N)
        h = 3 * h + 1;
    h = Math.floor((h - 1) / 3);

    while (h > 0) {
        output(h + " : ");
        for (const v of s) {
            output(v + " ");
        }
        output("\n");
        for (i = h; i < N; i++) {
            for (const v of s) {
                output(v + " ");
            }
            output("\n");
            j = i;
            while ((j >= h) && (s[j - h] > s[j])) {
                [s[j], s[j - h]] = [s[j - h], s[j]];
                j -= h;
            }
        }
        h = Math.floor((h - 1) / 3);
    }
}

function main() {
    const s = [8, 3, 4, 1, 7, 6, 9, 5, 0];
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -2, -1, 6];
    // const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];

    shellSort(s);
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
}

main();
