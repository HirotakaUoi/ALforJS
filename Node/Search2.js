// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0];
    const N = s.length;     //番兵を置く前の大きさ

    const d = parseInt(await input("Input search number: "), 10);
    s[N] = d;   //配列の最後に番兵としてdを追加する（JSの配列は自動で伸びるのでダミーは要らない）

    let i = 0;
    while (s[i] !== d) i++;
    if (i === N) {  //iが番兵を指していたら…
        output("I can't find: " + d + "\n");
    } else {
        output("Found: " + d + " at index " + i + "\n");
    }
}

main().finally(close);
