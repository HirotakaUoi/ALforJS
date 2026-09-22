// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

function radixSort(s, max) {
    const N = s.length;
    let i, j, k, n;

    // C++の vector<int> b[10] 相当：10個の空配列（配列リテラルで十分）
    const b = [[], [], [], [], [], [], [], [], [], []];

    for (n = 1; n < max; n *= 10) {
        for (i = 0; i < 10; i++) b[i] = [];

        for (i = 0; i < N; i++)
            b[Math.floor(s[i] / n) % 10].push(s[i]);

        for (k = 0; k < 10; k++) {
            output(k + ": ");
            for (i = 0; i < b[k].length; i++)
                output(String(b[k][i]).padStart(3, "0") + " ");
            output("\n");
        }
        k = 0;
        for (j = 0; j < 10; j++)
            for (i = 0; i < b[j].length; i++)
                s[k++] = b[j][i];
        for (const v of s) {
            output(v + " ");
        }
        output("\n");
    }
}

function main() {
    // const s = [345, 98, 302, 719, 804, 620, 183, 431, 572];
    const s = [];
    const N = 20;
    for (let i = 0; i < N; i++) {
        s[i] = (rand() % 1000);
    }
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
    radixSort(s, 1000);
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
}

main();
