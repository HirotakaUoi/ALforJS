// 全JSファイルに2つの修正を適用する
// 1. print() のブラウザ側を textContent += （出力量の2乗コスト）から
//    createTextNode の追記（1回ごと一定コスト）に変更
// 2. 末尾の main() 自動実行を Node.js のみにする（ブラウザは「実行」ボタンから呼ぶ）
const fs = require('fs');
const path = require('path');

const ROOT = '/Volumes/Dropbox/Dropbox/MyProjects/Claude/AL by JS for CC/Javascript';

const targets = [];
for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.js')) targets.push(path.join(ROOT, f));
}
for (const f of fs.readdirSync(path.join(ROOT, '文字列アルゴリズム'))) {
    if (f.endsWith('.js')) targets.push(path.join(ROOT, '文字列アルゴリズム', f));
}

const OLD_PRINT = "        document.getElementById('output').textContent += s;";
const NEW_PRINT = "        // appendChild(createTextNode) は追記のたびに全文をコピーしないため大量出力でも速い\n" +
                  "        document.getElementById('output').appendChild(document.createTextNode(String(s)));";

for (const file of targets) {
    let src = fs.readFileSync(file, 'utf8');

    if (!src.includes(OLD_PRINT)) throw new Error('printの旧実装が見つからない: ' + file);
    src = src.replace(OLD_PRINT, NEW_PRINT);

    if (!/\nmain\(\);/.test(src)) throw new Error('main(); が見つからない: ' + file);
    src = src.replace(/\nmain\(\);/, '\nif (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ');

    fs.writeFileSync(file, src);
    console.log('OK: ' + path.relative(ROOT, file));
}
console.log('total: ' + targets.length);
