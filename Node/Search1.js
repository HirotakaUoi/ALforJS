// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0];
    const N = 8;    //配列の大きさをNという定数にする

    const d = parseInt(await input("Input search number: "), 10);     //入力タイミングの提示

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            output("Found: " + d + " at index " + i + "\n");
            return;
        }
    }
    output("I can't find: " + d + "\n");     //少し丁寧な返事
}

main().finally(close);
