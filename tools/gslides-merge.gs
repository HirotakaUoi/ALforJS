/**
 * C++版の Google スライドに、JS版から必要なスライドを入れる
 *
 *   置き換え(R)  75枚 … C++版のスライドを消して、JS版の同じ内容を入れる
 *   挿入(I)      64枚 … JS版にしかないスライドを、決まった位置に入れる
 *   合計        139枚
 *
 * ──────────────────────────────────────────────
 * 準備
 *   1. アルゴリズム基礎論 2026X.pptx を Drive に置く
 *   2. それを右クリック →「アプリで開く」→「Google スライド」
 *      （pptx が Google スライド形式のデッキに変換される）
 *   3. 変換してできたデッキの名前を変える（例:「アルゴリズム基礎論 2026X JS版」）
 *      ★ そのままだと C++版と同じ名前になり、どちらか分からなくなる
 *   4. C++版のデッキを複製する（ファイル → コピーを作成）。名前は例:「… 2026X 作業用」
 *      ★ いきなり本番を書き換えないこと。まず複製で試す
 *   5. 下の SRC_NAME / DEST_NAME を、その2つの名前に合わせる
 *   6. 複製したデッキを開き、拡張機能 → Apps Script にこのファイルを貼る
 *
 * 使い方
 *   plan()   … 何も変更せず、これから何をするかだけ表示する（まずこれ）
 *   apply()  … 実際に入れ替える。6分で止まっても、もう一度呼べば続きから進む
 *   reset()  … 途中経過を捨てて最初からやり直す
 *
 * 仕組み
 *   insertSlide(位置, 別デッキのスライド) は、書式ごと複製してくれる。
 *   後ろから順に処理するので、まだ触っていない位置の番号はずれない。
 */

// ====== ここを自分のデッキ名に合わせる ======
// ★ 2つが同じ名前だと開けない。pptx を変換したデッキの名前を必ず変えること。
//    （pptx が「アルゴリズム基礎論 2026X.pptx」なら、変換後も同じ名前になるため）
var SRC_NAME  = 'アルゴリズム基礎論 2026X JS版';    // JS版（pptx を変換して改名したもの）
var DEST_NAME = 'アルゴリズム基礎論 2026X 作業用';  // 書き換える先（C++版の複製）
// ==========================================

// 1回の実行で使う時間の上限（秒）。6分の制限より手前で切り上げる
var TIME_BUDGET = 280;

// [種類, C++番号, JS番号]
//   R = その C++ スライドを消して、JS スライドを同じ位置に入れる
//   I = その C++ スライドの後ろに、JS スライドを入れる
var OPS = [
  ["I",1,2], ["R",14,15], ["R",15,16], ["R",18,19], ["I",27,29], ["I",27,30],
  ["I",27,31], ["I",27,32], ["I",27,33], ["I",27,34], ["I",27,35], ["I",27,36],
  ["I",27,37], ["I",27,38], ["I",27,39], ["I",27,40], ["I",27,41], ["I",27,42],
  ["I",27,43], ["I",33,50], ["R",34,51], ["I",40,58], ["I",43,62], ["I",43,63],
  ["I",43,64], ["I",43,65], ["I",43,66], ["I",43,67], ["I",43,68], ["I",43,69],
  ["I",43,70], ["I",43,71], ["I",43,72], ["I",43,73], ["I",43,74], ["I",43,75],
  ["I",43,76], ["I",43,77], ["I",43,78], ["I",43,79], ["I",43,80], ["I",43,81],
  ["I",43,82], ["I",43,83], ["I",43,84], ["I",43,85], ["I",43,86], ["I",43,87],
  ["I",43,88], ["I",43,89], ["I",43,90], ["I",43,91], ["I",43,92], ["I",43,93],
  ["I",43,94], ["I",43,95], ["I",43,96], ["I",43,97], ["I",43,98], ["I",43,99],
  ["I",43,100], ["I",43,101], ["I",43,102], ["I",43,103], ["I",43,104], ["I",43,105],
  ["I",43,106], ["I",43,107], ["R",48,112], ["R",50,114], ["R",56,120], ["R",57,121],
  ["R",62,126], ["R",63,127], ["R",64,128], ["R",70,134], ["R",71,135], ["R",81,145],
  ["R",82,146], ["R",90,154], ["R",91,155], ["R",93,157], ["R",94,158], ["R",95,159],
  ["R",97,161], ["R",98,162], ["R",106,170], ["R",108,172], ["R",109,173], ["R",110,174],
  ["R",111,175], ["R",115,179], ["R",117,181], ["R",118,182], ["R",119,183], ["R",123,187],
  ["R",125,189], ["R",126,190], ["R",132,196], ["R",133,197], ["R",134,198], ["R",138,202],
  ["R",139,203], ["R",146,210], ["R",147,211], ["R",153,217], ["R",161,225], ["R",163,227],
  ["R",170,234], ["R",171,235], ["R",172,236], ["R",184,248], ["R",185,249], ["R",186,250],
  ["R",187,251], ["R",190,254], ["R",191,255], ["R",192,256], ["R",197,261], ["R",198,262],
  ["R",199,263], ["R",204,268], ["R",207,271], ["R",215,279], ["R",216,280], ["R",219,283],
  ["R",224,288], ["R",225,289], ["R",228,292], ["R",229,293], ["R",233,297], ["R",235,299],
  ["R",238,302], ["R",239,303], ["R",241,305], ["R",247,311], ["R",248,312], ["R",252,316],
  ["R",253,317],
];

// 宛先が本当に C++版かを確かめるための見本（C++番号と見出しの先頭）
var SAMPLE = [
  [2, "アルゴリズム基礎論"],
  [7, "アルゴリズムとは?"],
  [8, "言い換えれば..."],
  [9, "ではレシピを..."],
  [12, "焼いてみる?"],
  [13, "焼いてみる?(続)"],
  [16, "プログラムチックなレシピの例"],
  [17, "ここで，ちょっとC++のお話"],
  [19, "C++のリテラル色々ありますが..."],
  [20, "C++のプログラム構成"],
];

// ---------------------------------------------------------------

function plan()  { return run_(true);  }
function apply() { return run_(false); }

function reset() {
  PropertiesService.getScriptProperties().deleteProperty('done');
  log_('途中経過を消しました。次は最初から実行します。');
}

function run_(dryRun) {
  var t0 = new Date().getTime();
  var src  = openByName_(SRC_NAME);
  var dest = openByName_(DEST_NAME);
  var out = [];

  out.push('元 : ' + SRC_NAME  + '（' + src.getSlides().length  + ' 枚）');
  out.push('先 : ' + DEST_NAME + '（' + dest.getSlides().length + ' 枚）');
  out.push('');

  var warn = verify_(dest);
  if (warn.length) {
    out.push('▼ 宛先の確認で気になる点');
    for (var w = 0; w < warn.length; w++) out.push('   ' + warn[w]);
    out.push('   → 宛先が C++版でないか、すでに一部入れ替え済みかもしれません。');
    out.push('');
  } else {
    out.push('宛先は C++版とみて問題なさそうです（見本 ' + SAMPLE.length + ' 枚が一致）');
    out.push('');
  }

  // 後ろから処理する。R は位置 n、I は位置 n+0.5 とみなして降順に並べる。
  // 同じ位置に入れるものは JS番号の大きい方から入れると、最後に正しい順になる。
  var list = [];
  for (var i = 0; i < OPS.length; i++) {
    list.push({ kind: OPS[i][0], cpp: OPS[i][1], js: OPS[i][2],
                key: OPS[i][1] + (OPS[i][0] === 'I' ? 0.5 : 0), i: i });
  }
  list.sort(function (a, b) { return (b.key - a.key) || (b.js - a.js); });

  var doneSet = loadDone_();
  var todo = [];
  for (var t = 0; t < list.length; t++) if (!doneSet[list[t].i]) todo.push(list[t]);
  out.push('作業 ' + OPS.length + ' 件 / 済み ' + (OPS.length - todo.length) + ' 件 / 残り ' + todo.length + ' 件');

  if (dryRun) {
    out.push('');
    out.push('=== これから行うこと（後ろから順に）===');
    for (var k = 0; k < Math.min(todo.length, 20); k++) {
      var o = todo[k];
      out.push(o.kind === 'R'
        ? '  差替  先の ' + o.cpp + ' 枚目 ← 元の ' + o.js + ' 枚目'
        : '  挿入  先の ' + o.cpp + ' 枚目の後ろへ ← 元の ' + o.js + ' 枚目');
    }
    if (todo.length > 20) out.push('  … ほか ' + (todo.length - 20) + ' 件');
    out.push('');
    out.push('※ plan() は何も変更していません。実行するなら apply() を呼んでください。');
    log_(out.join('\n'));
    return out.join('\n');
  }

  // スライドの一覧は最初に1回だけ取る。
  // 後ろから処理するので、先に取った「元の C++ スライド」の手がかりは
  // 途中で挿入しても有効なまま（毎回取り直すと往復が 75 回増えて遅くなる）。
  var srcSlides  = src.getSlides();
  var destSlides = dest.getSlides();
  var n = 0;
  for (var j = 0; j < todo.length; j++) {
    if ((new Date().getTime() - t0) / 1000 > TIME_BUDGET) {
      out.push('');
      out.push('時間の上限に達したので、ここで区切ります。');
      break;
    }
    var op = todo[j];
    var s = srcSlides[op.js - 1];
    if (!s) throw new Error('元デッキに ' + op.js + ' 枚目がありません');

    if (op.kind === 'R') {
      var target = destSlides[op.cpp - 1];
      if (!target) throw new Error('先デッキに ' + op.cpp + ' 枚目がありません');
      dest.insertSlide(op.cpp - 1, s);      // 同じ位置に入れてから
      target.remove();                      // 元のを消す
    } else {
      dest.insertSlide(op.cpp, s);          // その後ろへ
    }
    doneSet[op.i] = 1;
    n++;
    if (n % 10 === 0) saveDone_(doneSet);   // 10件ごとに途中経過を残す
  }
  saveDone_(doneSet);

  var done = 0;
  for (var key in doneSet) if (doneSet.hasOwnProperty(key)) done++;
  var rest = OPS.length - done;
  out.push('');
  out.push('今回 ' + n + ' 件を処理しました。残り ' + rest + ' 件。');
  out.push(rest === 0 ? 'すべて終わりました。' : 'もう一度 apply() を実行すると続きから進みます。');
  out.push('かかった時間: ' + ((new Date().getTime() - t0) / 1000).toFixed(1) + ' 秒');
  log_(out.join('\n'));
  return out.join('\n');
}

/** 名前で Google スライドを1つ開く */
function openByName_(name) {
  var it = DriveApp.getFilesByName(name);
  var found = [];
  while (it.hasNext()) {
    var f = it.next();
    if (f.getMimeType() === MimeType.GOOGLE_SLIDES) found.push(f);
  }
  if (found.length === 0) {
    throw new Error('「' + name + '」という名前の Google スライドが見つかりません。\n' +
      'pptx のままだと見つかりません。Drive で右クリック →「アプリで開く」→「Google スライド」で変換してください。');
  }
  if (found.length > 1) {
    throw new Error('「' + name + '」という名前のデッキが ' + found.length + ' 個あります。名前を分けてください。');
  }
  return SlidesApp.openById(found[0].getId());
}

/** 宛先が C++版かどうか、見本の見出しで確かめる */
function verify_(dest) {
  var slides = dest.getSlides();
  var warn = [];
  for (var i = 0; i < SAMPLE.length; i++) {
    var no = SAMPLE[i][0], want = SAMPLE[i][1];
    var s = slides[no - 1];
    if (!s) { warn.push(no + ' 枚目がありません'); continue; }
    var t = firstText_(s).replace(/\s/g, '');
    if (t.indexOf(want.replace(/\s/g, '')) !== 0) {
      warn.push(no + ' 枚目の見出しが違います（期待「' + want + '」／実際「' + t.slice(0, 18) + '」）');
    }
  }
  return warn;
}

/** そのスライドで最初に見つかる文字（＝たいてい見出し） */
function firstText_(slide) {
  var els = slide.getPageElements();
  for (var i = 0; i < els.length; i++) {
    try {
      if (els[i].getPageElementType() !== SlidesApp.PageElementType.SHAPE) continue;
      var s = els[i].asShape().getText().asString().trim();
      if (s) return s;
    } catch (e) {
      // 画像・線などは飛ばす
    }
  }
  return '';
}

function loadDone_() {
  var raw = PropertiesService.getScriptProperties().getProperty('done');
  return raw ? JSON.parse(raw) : {};
}

function saveDone_(d) {
  PropertiesService.getScriptProperties().setProperty('done', JSON.stringify(d));
}

function log_(msg) {
  Logger.log(msg);
  try {
    SlidesApp.getUi().alert(msg.length > 1200 ? msg.slice(0, 1200) + '\n…' : msg);
  } catch (e) {
    // メニュー以外から実行したときは alert を出せない
  }
}
