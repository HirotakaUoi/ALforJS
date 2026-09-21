// ====== 共通の入出力機能（変更しない）======
import { output, input } from "./io.js";
// ==========================================

function main() {
    for (let i = 0; true; i++) {
        output(i + ":\tこんにちは！ 魚井!\n");
    }
}

main();
