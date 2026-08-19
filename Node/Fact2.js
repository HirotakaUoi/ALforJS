// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function fact(n) {
    let f = 1;
    while (n >= 1) {
        f = n * f;
        n--;
    }
    return f;
}


async function main() {
    const n = parseInt(await input("Input number: "), 10);

    output(fact(n) + "\n");
}

main().finally(close);
