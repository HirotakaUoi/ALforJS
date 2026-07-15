// Javascript/html/ に各プログラムのブラウザ実行ページと一覧 index.html を生成する
const fs = require('fs');
const path = require('path');

const ROOT = '/Volumes/Dropbox/Dropbox/MyProjects/Claude/AL by JS for CC/Javascript';
const OUT = path.join(ROOT, 'html');
fs.mkdirSync(OUT, { recursive: true });

// 実行に注意が要るプログラムの注記
const NOTES = {
    'SleepSort1': '値×1秒待って出力するため、完走まで約30秒かかります。',
    'BogoSort1': '運まかせのソートです。要素数が多いと終わらないことがあります。',
    'BigSearch1': 'ソートの途中経過を大量に表示するため、配列サイズは1000程度までがおすすめです。',
    'BigSort1': '配列サイズは 100000〜1000000 程度がおすすめです。',
    'BigSort2': '配列サイズは 10000〜100000 くらいがおすすめです。BubbleSortは大きいと時間がかかります。',
    'BitonicSort2': '2^N の N（3〜4程度）を入力してください。デバッグ出力が大量に出ます。',
};

function pageFor(name, relSrc, note, needsInput) {
    const inputBox = needsInput ? `
<p>プログラムへの入力（cin 相当）: 下の欄に <b>1行に1つずつ</b>、実行前に書いておいてください。<br>
欄が空のときは入力ダイアログ（prompt）を使います。
<b>VSCode内蔵ブラウザはダイアログが出ないため、必ずこの欄を使ってください。</b></p>
<textarea id="stdin" rows="3" cols="30" placeholder="例:&#10;100&#10;7"></textarea>
<br>
` : '';
    return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${name}</title>
<style>
    body { font-family: sans-serif; margin: 2em; }
    pre  { background: #f4f4f4; padding: 1em; border-radius: 6px; white-space: pre-wrap; }
    a    { text-decoration: none; }
    button { font-size: 1em; padding: 0.4em 1.5em; margin-top: 0.5em; }
    textarea { font-size: 1em; }
</style>
</head>
<body>
<p><a href="index.html">&larr; 一覧に戻る</a></p>
<h1>${name}</h1>
${note ? `<p>※ ${note}</p>` : ''}
${inputBox}
<button onclick="window._stdin=null; document.getElementById('output').textContent=''; main();">実行</button>
<pre id="output"></pre>
<script src="${relSrc}"></script>
</body>
</html>
`;
}

// プログラムが input() を使うかどうかはソース中の『input("』の有無で判定
function usesInput(file) {
    return fs.readFileSync(file, 'utf8').includes('input("');
}

const entries = [];
for (const f of fs.readdirSync(ROOT).sort()) {
    if (f.endsWith('.js')) entries.push({ name: f.replace(/\.js$/, ''), rel: '../' + f, needsInput: usesInput(path.join(ROOT, f)) });
}
for (const f of fs.readdirSync(path.join(ROOT, '文字列アルゴリズム')).sort()) {
    if (f.endsWith('.js')) entries.push({ name: f.replace(/\.js$/, ''), rel: '../文字列アルゴリズム/' + f, group: '文字列アルゴリズム', needsInput: usesInput(path.join(ROOT, '文字列アルゴリズム', f)) });
}

for (const e of entries) {
    fs.writeFileSync(path.join(OUT, e.name + '.html'), pageFor(e.name, e.rel, NOTES[e.name], e.needsInput));
}

// 一覧ページ
const mainList = entries.filter(e => !e.group)
    .map(e => `<li><a href="${e.name}.html">${e.name}</a></li>`).join('\n');
const strList = entries.filter(e => e.group === '文字列アルゴリズム')
    .map(e => `<li><a href="${e.name}.html">${e.name}</a></li>`).join('\n');

fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>アルゴリズム教材（JavaScript版）一覧</title>
<style>
    body { font-family: sans-serif; margin: 2em; max-width: 40em; }
    li   { margin: 0.3em 0; }
    a    { text-decoration: none; }
</style>
</head>
<body>
<h1>アルゴリズム教材（JavaScript版）</h1>
<p>各ページの「実行」ボタンでプログラムが動きます。入力があるものはページ上の入力欄に値を書いてから実行してください
（欄が空だと入力ダイアログになります。VSCode内蔵ブラウザはダイアログ非対応なので入力欄を使うこと）。<br>
同じ .js ファイルは <code>node Javascript/〈名前〉.js</code> でターミナルからも実行できます。</p>
<h2>ソート・探索など</h2>
<ul>
${mainList}
</ul>
<h2>文字列アルゴリズム</h2>
<ul>
${strList}
</ul>
</body>
</html>
`);

console.log('生成: ' + (entries.length + 1) + ' ファイル（html/）');
