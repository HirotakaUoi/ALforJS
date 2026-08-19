// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function fact(n) {
    if (n === 1) {
        return 1;
    } else {
        return n * fact(n - 1);
    }
}

async function main() {
    const n = parseInt(await input("Input number: "), 10);

    output(fact(n) + "\n");
}

main().finally(close);
