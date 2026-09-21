// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function fact(n) {
    let f = 1;
    while (n >= 1) {
        f = n * f;
        n--;
    }
    return f;
}


function main() {
    const n = parseInt(input("Input number: "));

    output(fact(n) + "\n");
}

main();
