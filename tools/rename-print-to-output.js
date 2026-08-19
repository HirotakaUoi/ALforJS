// print を output に一括改名する（一度きり）
//
// p5.js がグローバルの print を自前のもので上書きしてくるため、名前の衝突を根本から避ける。
// output / input は p5 とも window とも衝突しない。
//
// 使い方: node tools/rename-print-to-output.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SUB = '文字列アルゴリズム';

const files = [];
for (const f of fs.readdirSync(path.join(ROOT, 'Node')).sort()) {
    if (f.endsWith('.js') || f.endsWith('.d.ts')) files.push(path.join(ROOT, 'Node', f));
}
for (const f of fs.readdirSync(path.join(ROOT, 'Node', SUB)).sort()) {
    if (f.endsWith('.js')) files.push(path.join(ROOT, 'Node', SUB, f));
}
for (const f of ['io.js', 'runner.js']) files.push(path.join(ROOT, 'Web', f));

let total = 0;
for (const f of files) {
    const before = fs.readFileSync(f, 'utf8');
    const after = before
        .replace(/\bmyPrint\b/g, 'myOutput')
        .replace(/\bprint\b/g, 'output');
    if (after !== before) {
        fs.writeFileSync(f, after);
        total += before.split(/\bprint\b/).length - 1;
    }
}
console.log('改名: ' + files.length + ' ファイル、' + total + ' か所');
