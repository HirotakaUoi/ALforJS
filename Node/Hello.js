// ====== 共通の入出力機能（変更しない）======
import { output, input, close } from "./io.js";
// ==========================================

async function main() {
    output("こんにちは！ 魚井!\n");
}

main().finally(close);
