// ====== 共通の入出力機能（変更しない）======
import { output, input, close } from "./io.js";
// ==========================================

async function main() {
    for (let i = 0; true; i++) {
        output(i + ":\tこんにちは！ 魚井!\n");
    }
}

main().finally(close);
