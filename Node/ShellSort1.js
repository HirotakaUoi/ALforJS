// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function shellSort(s) {
    const N = s.length;
    let temp, i, j, h;

    h = 1;
    while (h < N)
        h = 3 * h + 1;
    h = Math.floor((h - 1) / 3);

    while (h > 0) {
        output(h + " : ");
        for (let x = 0; x < N; x++) {
            output(s[x] + " ");
        }
        output("\n");
        for (i = h; i < N; i++) {
            for (let x = 0; x < N; x++) {
                output(s[x] + " ");
            }
            output("\n");
            j = i;
            while ((j >= h) && (s[j - h] > s[j])) {
                temp = s[j];
                s[j] = s[j - h];
                s[j - h] = temp;
                j -= h;
            }
        }
        h = Math.floor((h - 1) / 3);
    }
}

async function main() {
    const s = [8, 3, 4, 1, 7, 6, 9, 5, 0];
    const N = s.length;
// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -2, -1, 6];
// const N = 14;
// const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
// const N = 9;


    shellSort(s);
    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");
}



// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];

main().finally(close);
