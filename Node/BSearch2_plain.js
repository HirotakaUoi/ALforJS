// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function bsearch(dst, first, last, s, step) {
    if (first > last) return -1;
    const center = Math.floor((first + last) / 2);

    if (dst === s[center]) {
        return center;
    } else if (dst < s[center]) {
        return bsearch(dst, first, center - 1, s, step + 1);
    } else {
        return bsearch(dst, center + 1, last, s, step + 1);
    }
}

async function main() {
    const s = [0, 1, 2, 4, 5, 7, 8, 9];
    const N = 8;
    const d = parseInt(await input("Input search number: "), 10);

    const res = bsearch(d, 0, N - 1, s, 0);
    if (res === -1) {
        output("I can't find: " + d + "\n");
    } else {
        output("Found: " + d + " at index " + res + "\n");
    }
}

main().finally(close);
