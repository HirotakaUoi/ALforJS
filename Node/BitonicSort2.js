// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

function swap(s, i, j) {
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
}

function bitonicSort(s, N) {
    for (let fb = 1; fb <= N; fb++) {
        for (let sb = fb - 1; sb >= 0; sb--) {
            // ここの繰り返しは並列実行可能!!
            for (let i = 0; i < (1 << N); i++) {
                output("fb= " + fb + " sb= " + sb + " i= " + i + " i^(1<<sb)= " + (i ^ (1 << sb)));
                output(" (i>>fb)= " + (i >> fb) + " (i>>sb)= " + (i >> sb));
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1))) {
                        output(" C " + " s[i]= " + s[i] + " s[i^(1<<sb)]= "
                        + s[i ^ (1 << sb)] + " " + Number(((((i >> fb) & 1) ^ ((i >> sb) & 1)) && (s[i] < s[i ^ (1 << sb)])) ? 1 : 0));
                }
                output("\n");
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && (s[i] < s[i ^ (1 << sb)])) {
                    swap(s, i, i ^ (1 << sb));
                }
            }
        }
    }
}

async function main() {
    const logArraySize = parseInt(await input("Input array size by 2^N: "), 10);
// ( n<<N は nのN bit左シフト == n*(2^N))
    const s = [];   // JSの配列は自動拡張されるため大きさの指定は不要
    const N = logArraySize;
    for (let i = 0; i < (1 << logArraySize); i++) {
        s[i] = (rand() % 100);
    }
    for (let k = 0; k < (1 << logArraySize); k++) {
        output(s[k] + " ");
    }
    output("\n");

    bitonicSort(s, N);
    for (let k = 0; k < (1 << logArraySize); k++) {
        output(s[k] + " ");
    }
    output("\n");
}

main().finally(close);
