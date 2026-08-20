// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {

    const s = [0, 1, 2, 4, 5, 7, 8, 9];
    const N = s.length;
    let i;

    const d = parseInt(await input("Input search number: "), 10);

    for (i = 0; i < N; i++) {
        if (d <= s[i])
            break;
    }

    if ((i < N) && (d === s[i])) {  // dが見つかったなら…
        output("Found: " + d + " at index " + i + "\n");
    } else {
        output("I can't find: " + d + "\n");
    }
}

main().finally(close);
