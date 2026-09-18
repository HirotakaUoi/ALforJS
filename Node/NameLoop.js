// ====== 共通の入出力機能（変更しない）======
import { output, input, close } from "./io.js";
// ==========================================

async function main() {
    const name = await input("Input your name: ");  //名前は文字列のまま使う
    const n = parseInt(await input("Input number of times: "));  //回数は数値にする

    for (let i = 0; i < n; i++) {
        output("こんにちは！ " + name + "!\n");
    }
}

main().finally(close);
