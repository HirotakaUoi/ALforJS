// ====== 共通の入力機能（変更しない）======
// Node.js・ブラウザ両対応の同期入力（C++の cin >> 相当）
// Node.jsでは標準入力から1行だけ読み、ブラウザでは入力ダイアログを出す
const input = (typeof window !== 'undefined')
    ? (msg) => window.prompt(msg)
    : (msg) => {
        process.stdout.write(msg);
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
    };
// ========================================

function main() {
    const s = [4, 5, 2, 8, 7, 1, 9, 0];
    const N = 8;    //配列の大きさをNという定数にする

    const d = parseInt(input("Input search number: "), 10);  //入力タイミングの提示

    for (let i = 0; i < N; i++) {
        if (d === s[i]) {
            process.stdout.write("Found: " + d + " at index " + i + "\n");
            return;
        }
    }
    process.stdout.write("I can't find: " + d + "\n"); //少し丁寧な返事
}

main();
