// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function merge(s, first, last, b) {
    let i, j, k;

    output("Merge  " + first + " " + last + "    ");
    for (let q = first; q <= last; q++)
        output(s[q] + " ");
    output("\n");

    if (first < last) {
        const center = Math.floor((first + last) / 2);
        merge(s, first, center, b);
        merge(s, center + 1, last, b);

        for (i = first; i <= center; i++)
            b[i] = s[i];
        for (i = center + 1; i <= last; i++)
            b[last + center + 1 - i] = s[i];

        i = first;
        j = last;
        for (k = first; k <= last; k++)
            if (b[i] < b[j]) {
                s[k] = b[i];
                i++;
            } else {
                s[k] = b[j];
                j--;
            }
    }
    output("Merged " + first + " " + last + "    ");
    for (let q = first; q <= last; q++)
        output(s[q] + " ");
    output("\n");

}

function mergeSort(s) {
    const N = s.length;
    const b = [];   // JSの配列は自動拡張されるため大きさの指定は不要
    merge(s, 0, N - 1, b);
}

async function main() {
    const s = [4, 5, 2, 3, 7, 10, 8, 1, 9, 6, 0, -1, -2];
// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
    const N = s.length;
    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");

    mergeSort(s);
    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");
}

main().finally(close);
