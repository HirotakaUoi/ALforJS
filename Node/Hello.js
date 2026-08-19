// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    output("こんにちは！ 魚井!\n");
}

main().finally(close);
