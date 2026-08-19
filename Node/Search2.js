// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0, 99999];  //配列の最後にとりあえず 99999 を置いておく
    const N = 8;    // 99999は除いた大きさ

    const d = parseInt(await input("Input search number: "), 10);
    s[N] = d;   //配列の最後(99999の位置)にdを置く

    let i = 0;
    while (s[i] !== d) i++;
    if (i === N) {  //iが配列の最後を指していたら…
        output("I can't find: " + d + "\n");
    } else {
        output("Found: " + d + " at index " + i + "\n");
    }
}

main().finally(close);
