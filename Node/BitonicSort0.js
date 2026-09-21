// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function rand() { return Math.floor(Math.random() * 2147483648); }

function swap(s, i, j) {
    [s[i], s[j]] = [s[j], s[i]];
}

function bitonicsort(lgn, ary) {
    for (let fb = 1; fb <= lgn; fb++) {
        for (let sb = fb - 1; sb >= 0; sb--) {
            // this loop can be parallelized
            for (let i = 0; i < (1 << lgn); i++) {
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && ary[i] < ary[i ^ (1 << sb)]) {
                    swap(ary, i, i ^ (1 << sb));
                }
            }
        }
    }
}

function main() {
    const lgn = 10;
    const ary = [];     // JSの配列は自動拡張されるため大きさの指定は不要
    output(String(1 << lgn));
    for (let i = 0; i < (1 << lgn); i++) {
        ary[i] = rand() % 10000;
    }
    bitonicsort(lgn, ary);
    for (let i = 0; i < (1 << lgn); i++) {
        output(ary[i] + ", ");
    }
    output("\n");
}

main();
