/**
 * Google スライドの中身を書き出す（下調べ用・読むだけで何も変更しない）
 *
 * 使い方
 *   1. 対象の Google スライドを開く
 *   2. 拡張機能 → Apps Script
 *   3. エディタの中身を全部消して、このファイルを貼り付けて保存
 *   4. 関数の一覧から inventory を選んで実行
 *      （初回は「承認が必要です」と出る → 自分のアカウントで許可する）
 *   5. 終わると Drive に「<デッキ名>_中身一覧」という Google ドキュメントができる
 *
 * 途中経過
 *   実行ログ（エディタ下部の「実行ログ」）に、どこで時間がかかっているかが出る。
 *
 * 準備（初回だけ）
 *   エディタ左の「サービス」の ＋ → 「Slides API」を選んで「追加」。
 *   これでスクリプトのプロジェクトに Slides API が有効になる。
 *   （やらないと HTTP 403 SERVICE_DISABLED になる）
 *
 * 速さについて
 *   SlidesApp で1枚ずつ図形をたどると、300枚規模では API の往復が千回近くなり
 *   6分の実行上限に当たる。ここではデッキ全体を1回で受け取り、
 *   あとはその場で解析する。数秒で終わる。
 *
 * 何もしないこと
 *   - スライドは一切変更しない（読むだけ）
 */

// ここを true にすると、コードらしきテキストを含むスライドだけ書き出す
var CODE_ONLY = false;

// コードらしさの判定に使う語（C++版・JS版のどちらでも拾えるようにしてある）
var CODE_HINTS = [
  'cout', 'cin', '#include', 'int main', 'using namespace', 'printf',
  'output(', 'input(', 'function ', 'const ', 'let ', 'main()'
];

function inventory() {
  var t0 = new Date().getTime();
  var mark = function (label) {
    Logger.log(label + ': ' + ((new Date().getTime() - t0) / 1000).toFixed(1) + ' 秒');
  };

  var pres = SlidesApp.getActivePresentation();
  var id = pres.getId();
  var name = pres.getName();
  mark('デッキを開いた');

  var data = fetchPresentation_(id);
  mark('取得できた');
  var slides = data.slides || [];

  var lines = [];
  lines.push('デッキ名: ' + name);
  lines.push('スライド ID: ' + id);
  lines.push('スライド数: ' + slides.length);
  lines.push('書き出し日時: ' + new Date().toLocaleString('ja-JP'));
  lines.push('');

  var codeCount = 0;
  var body = [];

  for (var i = 0; i < slides.length; i++) {
    var texts = textsOfSlide_(slides[i]);
    var hasCode = looksLikeCode_(texts.join('\n'));
    if (hasCode) codeCount++;
    if (CODE_ONLY && !hasCode) continue;

    body.push('==================================================');
    body.push('### スライド ' + (i + 1) + (hasCode ? '  [コードあり]' : ''));
    for (var k = 0; k < texts.length; k++) {
      if (texts[k].replace(/\s/g, '') === '') continue;
      body.push(texts[k]);
    }
    body.push('');
  }

  lines.push('コードを含むスライド: ' + codeCount + ' 枚');
  lines.push('');
  mark('文字を取り出した');

  var doc = DocumentApp.create(name + '_中身一覧');
  doc.getBody().setText(lines.concat(body).join('\n'));
  doc.saveAndClose();
  mark('ドキュメントに書き出した');

  var url = doc.getUrl();
  Logger.log('書き出しました: ' + url);
  try {
    SlidesApp.getUi().alert(
      '書き出しました\n\n' +
      'スライド ' + slides.length + ' 枚 / コードを含むもの ' + codeCount + ' 枚\n\n' +
      'Drive に「' + doc.getName() + '」ができています。\n' + url);
  } catch (e) {
    // メニュー以外から実行したときは alert を出せないので、ログだけ残す
  }
  return url;
}

/**
 * デッキ全体を1回の呼び出しで取ってくる（文字だけ）。
 * 有効化されていないときは、何をすればよいかを日本語で出す。
 */
function fetchPresentation_(id) {
  // REST を直接叩く。fields で「文字だけ」に絞るのが要。
  //
  // 拡張サービスの Slides.Presentations.get(id) は fields を指定できず、
  // マスター・レイアウト・全図形の座標と書式まで丸ごと返す。
  // 300枚規模では数十MBになり、取得も解析も遅くなるので使わない。
  var fields = [
    'slides(pageElements(',
      'shape(text(textElements(textRun(content))))',
      ',table(tableRows(tableCells(text(textElements(textRun(content))))))',
      ',elementGroup(children(shape(text(textElements(textRun(content))))))',
    '))'
  ].join('');
  var url = 'https://slides.googleapis.com/v1/presentations/' + encodeURIComponent(id) +
            '?fields=' + encodeURIComponent(fields);
  var res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code === 200) return JSON.parse(res.getContentText());

  if (code === 403 && res.getContentText().indexOf('SERVICE_DISABLED') !== -1) {
    throw new Error(
      'Slides API がこのスクリプトのプロジェクトで有効になっていません。\n\n' +
      '【直し方】Apps Script エディタの左側「サービス」の ＋ を押し、\n' +
      '一覧から「Slides API」を選んで「追加」を押してください。\n' +
      'そのあともう一度 inventory を実行します。\n' +
      '（有効化の反映に1〜2分かかることがあります）');
  }
  throw new Error('Slides API がエラーを返しました (HTTP ' + code + ')\n' + res.getContentText());
}

/**
 * スライド1枚ぶんの JSON から、文字列を「見た目の並び」で取り出す。
 * 図形・グループの入れ子・表のどれでも、textRun.content を拾えばよい。
 */
function textsOfSlide_(slide) {
  var out = [];
  var els = slide.pageElements || [];
  for (var i = 0; i < els.length; i++) {
    var s = collectRuns_(els[i]).join('');
    s = s.replace(/\v/g, '\n').replace(/\r/g, '');
    if (s.replace(/\s/g, '') !== '') out.push(trimEnd_(s));
  }
  return out;
}

/** JSON をたどって textRun.content を順に集める */
function collectRuns_(node) {
  var acc = [];
  if (node === null || typeof node !== 'object') return acc;
  if (node.textRun && typeof node.textRun.content === 'string') {
    acc.push(node.textRun.content);
    return acc;
  }
  if (Object.prototype.toString.call(node) === '[object Array]') {
    for (var i = 0; i < node.length; i++) acc = acc.concat(collectRuns_(node[i]));
    return acc;
  }
  for (var k in node) {
    if (Object.prototype.hasOwnProperty.call(node, k)) {
      acc = acc.concat(collectRuns_(node[k]));
    }
  }
  return acc;
}

/** CODE_HINTS のどれかを含んでいたら「コードあり」とみなす */
function looksLikeCode_(text) {
  if (!text) return false;
  for (var i = 0; i < CODE_HINTS.length; i++) {
    if (text.indexOf(CODE_HINTS[i]) !== -1) return true;
  }
  return false;
}

/** 末尾の改行・空白だけ落とす（行頭の字下げは残す） */
function trimEnd_(s) {
  return s.replace(/[\s　]+$/, '');
}
