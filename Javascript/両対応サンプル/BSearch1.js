//====== 環境判定と入出力の吸収層（Node.js・ブラウザ両対応）======
const isNode = (typeof window === "undefined");

function print(s) {                      // cout << 相当（改行なし出力）
    if (isNode) {
        process.stdout.write(s);
    } else {
        document.getElementById("output").textContent += s;
    }
}

async function input(msg) {              // cin >> 相当
    if (isNode) {
        const readline = await import("node:readline/promises");
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ans = await rl.question(msg);
        rl.close();
        return ans;
    } else {
        const ans = window.prompt(msg);
        print(msg + ans + "\n");         // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }
}
//==============================================================

async function main() {
    let d, i, first, last, center;
    const s = [0, 1, 2, 4, 5, 7, 8, 9];
    const N = 8;
    d = parseInt(await input("Input search number: "), 10);
    first = 0;
    last = N - 1;
    while (first <= last) { 				 // 探索範囲が空でない間
        print("First = " + first + ",Last = " + last + "\n");
        center = Math.floor((first + last) / 2);  // 範囲の真ん中を計算
        if (d === s[center]) {  				// 範囲の真ん中の値がｄと等しい
            print("Found: " + d + " at index " + center + "\n");
            return;
        } else if (d < s[center]) {  		// 範囲の真ん中の値がｄより大きい
            last = center - 1;       		// 範囲の後半分を省く
        } else {  							// 範囲の真ん中の値がｄより小さい
            first = center + 1;  			 // 範囲の前半分を省く
        }
    }
    print("I can't find: " + d + "\n");
}

main();
