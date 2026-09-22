// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function swap(s, i, j) {
    [s[i], s[j]] = [s[j], s[i]];
}

function bitonicSort(s, N) {
    for (let fb = 1; fb <= N; fb++) {
        for (let sb = fb - 1; sb >= 0; sb--) {
            // ここの繰り返しは並列実行可能!!
            for (let i = 0; i < (1 << N); i++) {
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && (s[i] < s[i ^ (1 << sb)])) {
                    //                  swap(s, i, i^(1<<sb));
                    const j = i ^ (1 << sb);
                    [s[i], s[j]] = [s[j], s[i]];
                }
            }
        }
    }
}

function main() {
    const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1, 5, 7, 2];
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2];
    const N = 4;
    // ( n<<N は nのN bit左シフト == n*(2^N))
    for (const v of s) {
        output(v + " ");
    }
    output("\n");

    bitonicSort(s, N);
    for (const v of s) {
        output(v + " ");
    }
    output("\n");
}

main();
