// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function main() {
    const name = input("Input your name: ");  //名前は文字列のまま使う
    const n = parseInt(input("Input number of times: "));  //回数は数値にする

    for (let i = 0; i < n; i++) {
        output("こんにちは！ " + name + "!\n");
    }
}

main();
