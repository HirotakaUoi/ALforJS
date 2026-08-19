// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function selectionSort(s, N) {
    let min, temp;
    for (let i = 0; i < N - 1; i++) {
        for (let k = 0; k < N; k++) {
            output(s[k] + " ");
        }
        output("\n");
        min = i;
        for (let j = i + 1; j < N; j++)
            if (s[min] > s[j])
                min = j;
        temp = s[i];
        s[i] = s[min];
        s[min] = temp;
    }

}

async function main() {
    const s = [4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0,];
// // const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
    const N = 11;
// const s = [4, 5, 2, 8, 7, 1];
// const N = 6;

// const s = [5, 4, 8, 2, 7, 0, 1];
// const N = 7;


    selectionSort(s, N);
    for (let k = 0; k < N; k++) {
        output(s[k] + " ");
    }
    output("\n");
}

main().finally(close);
