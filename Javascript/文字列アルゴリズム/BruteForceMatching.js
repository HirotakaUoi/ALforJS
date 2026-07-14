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

function BruteForce(p, s) {
    let matched;
    for (let i = 0; i <= s.length - p.length; i++) {
        matched = true;
        for (let j = 0; j < p.length; j++) {
            process.stdout.write("s[" + (i + j) + "]=" + s[i + j] + ",  p[" + j + "]=" + p[j] + "\n");
            if (s[i + j] !== p[j]) {
                matched = false;
                break;
            }
        }
        if (matched) return i;
    }
    return -1;
}

function main() {
    const p = input("Input pattern string: ");
    const s = input("Input string: ");
    process.stdout.write("0123456789012345678901234567890123456789\n");
    process.stdout.write(s + "\n");
    const result = BruteForce(p, s);
    if (result === -1)
        process.stdout.write("Pattern not matched!\n");
    else
        process.stdout.write("Pattern matched! at " + result + "\n");
}

main();
