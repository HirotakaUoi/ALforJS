// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function fact(n) {
    if (n === 1) {
        return 1;
    } else {
        return n * fact(n - 1);
    }
}

function main() {
    const n = parseInt(input("Input number: "));

    output(fact(n) + "\n");
}

main();
