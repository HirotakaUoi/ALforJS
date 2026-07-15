// Javascript/ 全ファイルに共通入出力ブロックを適用する一括変換スクリプト
const fs = require('fs');
const path = require('path');

const ROOT = '/Volumes/Dropbox/Dropbox/MyProjects/Claude/AL by JS for CC/Javascript';

const COMMON = `// ====== 共通の入出力機能（変更しない）======
// Node.js・ブラウザ両対応の入出力
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
const isNode = (typeof window === 'undefined');

function print(s) {
    if (isNode) {
        process.stdout.write(String(s));
    } else {
        document.getElementById('output').textContent += s;
    }
}

function input(msg) {
    if (isNode) {
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
            if (buf[0] === 10) break;               // '\\n' が来たら1行の終わり
            bytes.push(buf[0]);
        }
        return Buffer.from(bytes).toString('utf-8').trim();
    } else {
        const ans = window.prompt(msg);
        print(msg + ans + "\\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }
}
// ==========================================
`;

const OLD_START = '// ====== 共通の入力機能（変更しない）======';
const OLD_END = '// ========================================';

const targets = [];
for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.js')) targets.push(path.join(ROOT, f));
}
for (const f of fs.readdirSync(path.join(ROOT, '文字列アルゴリズム'))) {
    if (f.endsWith('.js')) targets.push(path.join(ROOT, '文字列アルゴリズム', f));
}

for (const file of targets) {
    let src = fs.readFileSync(file, 'utf8');

    // 旧・入力ブロックを削除
    const s = src.indexOf(OLD_START);
    if (s !== -1) {
        const e = src.indexOf(OLD_END, s);
        if (e === -1) throw new Error('終端マーカーなし: ' + file);
        let rest = src.slice(e + OLD_END.length);
        rest = rest.replace(/^\n+/, '');     // ブロック直後の空行を除去
        src = src.slice(0, s) + rest;
    }

    // 出力呼び出しを print() に統一
    src = src.split('process.stdout.write(').join('print(');
    // SleepSort1 の console.log も print() に統一
    src = src.split('console.log(s[i]);').join('print(s[i] + "\\n");');

    fs.writeFileSync(file, COMMON + '\n' + src);
    console.log('OK: ' + path.relative(ROOT, file));
}
console.log('total: ' + targets.length);
