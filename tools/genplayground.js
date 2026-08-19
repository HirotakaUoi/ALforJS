// Javascript/playground/ に、対話形式で実行できるページと一覧 index.html を生成する
//
// 元の Javascript/<名前>.js から
//   ・共通の入出力機能ブロック（print/input）を取り除く（playground/common/runner.js が提供するため）
//   ・末尾の「if (isNode) main();」を取り除く（ページの「実行」ボタンが呼ぶため）
//   ・input() を使うものは function main() → function* main()、input( → yield* input( に置換する
//     （21本すべて input() の呼び出しは main() の中だけなので、この2つの置換で足りる）
// という変換をして、ページに埋め込む。
//
// 使い方: node tools/genplayground.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'Javascript');
const OUT = path.join(ROOT, 'playground');
fs.mkdirSync(OUT, { recursive: true });

// 実行に注意が要るプログラムの注記
const NOTES = {
    'SleepSort1': '値×1秒待って出力するため、完走まで約30秒かかります。',
    'BogoSort1': '運まかせのソートです。要素数が多いと終わらないことがあります。',
    'BigSearch1': 'ソートの途中経過を大量に表示するため、配列サイズは1000程度までがおすすめです。',
    'BigSort1': '配列サイズは 100000〜1000000 程度がおすすめです。出力が出るまで少し待ちます。',
    'BigSort2': '配列サイズは 10000〜100000 くらいがおすすめです。BubbleSortは大きいと時間がかかります。',
    'BitonicSort2': '2^N の N（3〜4程度）を入力してください。デバッグ出力が大量に出ます。',
};

// 元のソースを、プレイグラウンドのソース欄に入れる形に変換する
function toPlaygroundSource(src) {
    // 1. 共通の入出力機能ブロック（先頭から「// ====…=」だけの行まで）を取り除く
    const lines = src.split('\n');
    let end = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^\/\/ =+$/.test(lines[i])) { end = i; break; }
    }
    let body = lines.slice(end + 1).join('\n');

    // 2. 末尾の「if (isNode) main();」の行を取り除く
    body = body.replace(/^if \(isNode\) main\(\);.*$/m, '');

    // 3. input() を使うものは Generator 形式にする
    if (/input\("/.test(body)) {
        body = body.replace(/^function main\(\)/m, 'function* main()');
        body = body.replace(/input\("/g, 'yield* input("');
    }

    return body.replace(/^\n+/, '').replace(/\s+$/, '') + '\n';
}

function pageFor(name, src, note) {
    // 入力のあるプログラムだけ、Generator形式についての説明を出す
    const inputNote = /yield\* input\(/.test(src) ? `<br>
      このプログラムは入力があるので <code>function* main()</code> ＋ <code>yield* input(msg)</code> の形になっています
      （途中で止まって入力を待つため）。` : '';
    return `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${name} プレイグラウンド</title>
<link rel="stylesheet" href="common/playground.css">
</head>
<body>

<p class="note"><a href="index.html">&larr; 一覧に戻る</a></p>
<h1>${name}</h1>
<p class="note">${note ? '※ ' + note + '<br>' : ''}
「実行」を押す（またはEnter）と開始。<code>input()</code>で止まったらターミナル内に入力欄が現れるので、
値を打ってEnterで続きが実行されます。</p>

<div class="panes">
  <section class="code-pane">
    <h2>ソースコード</h2>
    <p class="note" style="margin-bottom: 10px;">
      <code>print()</code> / <code>input()</code> は環境が提供する入出力（C++の cout / cin に相当）です。
      編集して「実行」を押すと、その内容で動きます。${inputNote}
    </p>
    <textarea id="source" spellcheck="false"></textarea>
  </section>
  <section class="terminal-pane">
    <h2>実行</h2>
    <div id="terminal" tabindex="0"></div>
    <div class="controls">
      <button id="runBtn">実行</button>
      <button id="resetBtn" class="secondary" disabled>リセット</button>
    </div>
  </section>
</div>

<script id="source-text" type="text/plain">
${src}</script>
<script src="common/runner.js"></script>

</body>
</html>
`;
}

const entries = [];
for (const f of fs.readdirSync(ROOT).sort()) {
    if (f.endsWith('.js')) entries.push({ name: f.replace(/\.js$/, ''), file: path.join(ROOT, f) });
}
for (const f of fs.readdirSync(path.join(ROOT, '文字列アルゴリズム')).sort()) {
    if (f.endsWith('.js')) entries.push({ name: f.replace(/\.js$/, ''), file: path.join(ROOT, '文字列アルゴリズム', f), group: '文字列アルゴリズム' });
}

for (const e of entries) {
    const src = toPlaygroundSource(fs.readFileSync(e.file, 'utf8'));
    fs.writeFileSync(path.join(OUT, e.name + '.html'), pageFor(e.name, src, NOTES[e.name]));
}

// 一覧ページ
const mainList = entries.filter(e => !e.group)
    .map(e => `<li><a href="${e.name}.html">${e.name}</a></li>`).join('\n');
const strList = entries.filter(e => e.group === '文字列アルゴリズム')
    .map(e => `<li><a href="${e.name}.html">${e.name}</a></li>`).join('\n');

fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>アルゴリズム プレイグラウンド 一覧</title>
<link rel="stylesheet" href="common/playground.css">
</head>
<body>

<h1>アルゴリズム プレイグラウンド</h1>
<p class="note">ターミナル風の画面で、キーボードから入力しながら対話的に実行できます。
ソースコードは画面上で編集してそのまま動かせます。サーバー不要（ファイルをダブルクリックで開けます）。</p>

<h2>ソート・探索など</h2>
<ul class="list">
${mainList}
</ul>
<h2>文字列アルゴリズム</h2>
<ul class="list">
${strList}
</ul>

<p class="note"><a href="../html/index.html">&rarr; テキスト版（入力欄に先に書いておく方式）の一覧へ</a></p>

</body>
</html>
`);

console.log('生成: ' + (entries.length + 1) + ' ファイル（playground/）');
