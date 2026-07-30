// ====== 共通の入出力機能（Node.js専用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
function print(s) {
    process.stdout.write(String(s));
}

function input(msg) {
    print(msg);
    const fs = require('fs');
    const buf = Buffer.alloc(1);
    const bytes = [];
    while (true) {
        let n;
        try {
            n = fs.readSync(0, buf, 0, 1);      // 1バイトずつ読む
        } catch (e) {
            if (e.code === 'EAGAIN') continue;  // パイプでまだデータが来ていない間は待つ
            throw e;
        }
        if (n === 0) break;                     // EOF
        if (buf[0] === 10) break;               // '\n' が来たら1行の終わり
        bytes.push(buf[0]);
    }
    return Buffer.from(bytes).toString('utf-8').trim();
}
// ==========================================

function main() {
    let d, i, first, last, center;
    const s = [0, 1, 2, 4, 5, 7, 8, 9];
    const N = 8;
    d = parseInt(input("Input search number: "), 10);
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
