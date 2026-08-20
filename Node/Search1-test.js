// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    const s = [3, 5, 2, 8, 7, 1, 9, 0, 10, 4];
    const N = s.length;

    const d = parseInt(await input("Input: "), 10);

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            output("Found at: " + i + "\n");
            return;
        }
    }
    output("I can't find\n");
}

main().finally(close);
