// Javascript/（Node・ブラウザ両対応版）から Node/（標準版）へ一度だけ移行する
//
// 両対応版を廃止し、Node版を標準とする方針に伴う一回限りの変換。
// 以後 Node/ が正なので、このスクリプトを再実行する必要はない。
//
//   ・共通の入出力ブロックを require("./io.js"); の1行に置き換える
//     （print / input / close / clock / CLOCKS_PER_SEC は io.js がグローバルに登録する）
//   ・main() を async にし、input(...) を await input(...) にする
//     （ブラウザではキーボード入力を同期で待てないため、両環境で async に統一する）
//   ・末尾を main().finally(close); にする
//   ・isNode は不要になるので消える。BigSort2 の clock() は io.js のものを使う
//
// 使い方: node tools/migrate-to-node.js
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'Javascript');
const DST = path.join(__dirname, '..', 'Node');
const SUB = '文字列アルゴリズム';

const HEADER = [
    '// ====== 共通の入出力機能（変更しない）======',
    'require("./io.js");',
    '// ==========================================',
    '',
    '',
].join('\n');

const FOOTER = '\nmain().finally(close);\n';

// BigSort2 だけが持っている clock() の定義。io.js に移したので取り除く
const CLOCK_BLOCK = `// C++のclock()相当：マイクロ秒を返す（Node.js・ブラウザ両対応）
// Node.js: process.hrtime.bigint()（ナノ秒）を換算（μs精度）
// ブラウザ: performance.now()（ミリ秒）を換算（セキュリティ対策で精度は粗め）
const CLOCKS_PER_SEC = 1000000;
function clock() {
    if (isNode) return Number(process.hrtime.bigint() / 1000n);
    return Math.round(performance.now() * 1000);
}

`;

function convert(src, name) {
    const lines = src.split('\n');
    const marker = lines.findIndex(l => /^\/\/ =+$/.test(l));
    if (marker < 0) throw new Error(name + ': 共通ブロックの閉じマーカーが見つからない');
    let body = lines.slice(marker + 1).join('\n');

    // 末尾の起動行を取り除く（新しい末尾は FOOTER）
    body = body.replace(/^if \(isNode\) main\(\);.*$/m, '');

    // clock() の定義を取り除く（io.js が提供する）
    if (body.includes(CLOCK_BLOCK)) body = body.replace(CLOCK_BLOCK, '');

    // main() を async に（QuickSort1P / QuickSort11P は元から async）
    body = body.replace(/^function main\(\)/m, 'async function main()');

    // input(...) は await して受け取る
    body = body.replace(/(?<!await )\binput\("/g, 'await input("');

    body = body.replace(/^\n+/, '').replace(/\s+$/, '') + '\n';

    if (/\bisNode\b/.test(body)) throw new Error(name + ': isNode が残っている');
    if (!/^async function main\(\)/m.test(body)) throw new Error(name + ': main が async になっていない');

    return HEADER + body + FOOTER;
}

const jobs = [];
for (const f of fs.readdirSync(SRC).sort()) {
    if (f.endsWith('.js')) jobs.push({ name: f, from: path.join(SRC, f), to: path.join(DST, f) });
}
for (const f of fs.readdirSync(path.join(SRC, SUB)).sort()) {
    if (f.endsWith('.js')) jobs.push({ name: SUB + '/' + f, from: path.join(SRC, SUB, f), to: path.join(DST, SUB, f) });
}

fs.mkdirSync(path.join(DST, SUB), { recursive: true });
for (const j of jobs) {
    fs.writeFileSync(j.to, convert(fs.readFileSync(j.from, 'utf8'), j.name));
}

// サブフォルダからも require("./io.js") で届くようにする中継ファイル。
// これで共通ブロックが全45ファイルで完全に同一になる
fs.writeFileSync(path.join(DST, SUB, 'io.js'),
    '// 共通の入出力機能は Node/io.js にある。サブフォルダからも\n'
    + '// require("./io.js") の1行で届くようにするための中継ファイル。\n'
    + 'require("../io.js");\n');

console.log('移行: ' + jobs.length + ' ファイル（Node/）');
