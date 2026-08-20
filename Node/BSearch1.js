// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

async function main() {
    let d, i, first, last, center;
    const s = [0, 1, 2, 4, 5, 7, 8, 9];
    const N = s.length;
    d = parseInt(await input("Input search number: "), 10);
    first = 0;
    last = N - 1;
    while (first <= last) {             // 探索範囲が空でない間
        output("First = " + first + ",Last = " + last + "\n");
        center = Math.floor((first + last) / 2);  // 範囲の真ん中を計算
        if (d === s[center]) {          // 範囲の真ん中の値がｄと等しい
            output("Found: " + d + " at index " + center + "\n");
            return;
        } else if (d < s[center]) {     // 範囲の真ん中の値がｄより大きい
            last = center - 1;          // 範囲の後半分を省く
        } else {                        // 範囲の真ん中の値がｄより小さい
            first = center + 1;         // 範囲の前半分を省く
        }
    }
    output("I can't find: " + d + "\n");
}

main().finally(close);
