// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function insertionSort(s) {
    const N = s.length;
    let j, temp;

    for (let i = 0; i < N - 1; i++) {
        for (let k = 0; k < N; k++) {
            output(s[k] + " ");
        }
        output("\n");
        j = i + 1;
        while ((j > 0) && (s[j - 1] > s[j])) {
            temp = s[j];
            s[j] = s[j - 1];
            s[j - 1] = temp;
            j--;
        }
    }
}

async function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 3, 0];
    const N = s.length;
// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
// const N = 13;

    insertionSort(s);
    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");
}




// const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2];
// const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];

main().finally(close);
