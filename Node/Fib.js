// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function f(n) {
    // output("F=" + n + "\n");
    if (n === 0) {
        return 0;
    } else if (n === 1) {
        return 1;
    } else {
        return f(n - 1) + f(n - 2);
    }
}

async function main() {
    const n = parseInt(await input("Input number: "), 10);

    output(f(n) + "\n");
}

main().finally(close);
