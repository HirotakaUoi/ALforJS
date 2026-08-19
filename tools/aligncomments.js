// Node/ の全ソースについて、コメントの位置を揃える
//
// 規則:
//   1. 共通の入出力機能ブロック（先頭〜「// ====…=」だけの行）は対象外。それより後ろだけを整形する
//   2. タブは半角4スペースに展開する
//      （スライドに載せたときタブ幅は表示環境で変わり、揃って見える保証がないため）
//   3. コードの後ろに付く行末コメントは、空行で区切られたブロックごとに同じ桁に揃える。
//      桁は「そのブロックで一番長いコード＋2桁」以上で最初のタブ位置（4の倍数）。
//      ただし1行だけ突出して長い行があると、他の行のコメントがそれに引きずられて遠くなるので、
//      「一番長い行が2番目より8桁（2タブ）以上長い」場合はその行を基準から外す（外したら繰り返す）。
//      基準から外れた行のコメントは、その行のコードの直後（2桁あけ）に置く
//   4. データ（初期配列）に付いているコメント ―― コメントアウトされた const s / const N ―― は
//      必ず行頭（1桁目）から始める。配列が複数行に折り返されている場合は続きの行も行頭に揃える
//   5. それ以外のコメントだけの行（コメントアウトされたコードなど）は位置を変えない
//
// 変更は空白のみ。`git diff -w` が空になることで確かめられる。
//
// 使い方: node tools/aligncomments.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'Node');
const TABSTOP = 4;     // タブを何桁に展開するか
const MINGAP = 2;      // コードとコメントの間の最小の空き
const OUTLIER = 8;     // これ以上ほかより長い行は「突出して長い」とみなし、揃える基準から外す

// タブを空白に展開する（桁位置をそろえるため単純な4桁固定ではなくタブストップで計算）
function expandTabs(s) {
    let out = '';
    for (const ch of s) {
        if (ch === '\t') out += ' '.repeat(TABSTOP - (out.length % TABSTOP));
        else out += ch;
    }
    return out;
}

// 文字列リテラルの中を避けて、行末コメントの「//」の位置を返す（無ければ -1）
function findComment(line) {
    let quote = null;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quote) {
            if (ch === '\\') i++;
            else if (ch === quote) quote = null;
        } else if (ch === '"' || ch === "'" || ch === '`') {
            quote = ch;
        } else if (ch === '/' && line[i + 1] === '/') {
            return i;
        }
    }
    return -1;
}

// コメントだけの行から、先頭の「/」と空白をすべて剥がした中身を取り出す
function commentBody(line) {
    return line.replace(/^[\s/]+/, '');
}

function alignFile(file) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const marker = lines.findIndex(l => /^\/\/ =+$/.test(l));
    if (marker < 0) throw new Error(file + ': 共通ブロックの閉じマーカーが見つからない');

    let pendingBrackets = 0;   // 折り返し中のデータ行で開いたままの「[」の数
    const trailing = [];       // 行末コメントが付いた行（桁は後でまとめて決める）

    for (let i = marker + 1; i < lines.length; i++) {
        const line = expandTabs(lines[i]);
        const trimmed = line.trim();

        if (trimmed === '') { lines[i] = ''; continue; }

        if (trimmed.startsWith('//')) {
            const body = commentBody(line);
            const isData = /^const\s+[sN]\b/.test(body);
            if (isData || pendingBrackets > 0) {
                // 規則4: データ行は行頭から
                if (isData) pendingBrackets = 0;
                pendingBrackets += (body.match(/\[/g) || []).length
                    - (body.match(/\]/g) || []).length;
                if (pendingBrackets < 0) pendingBrackets = 0;
                // 先頭の「//」は元の数のまま（二重にコメント化された行があるため）、
                // 行頭に寄せて空白だけを詰める。これで変更は空白のみに収まる
                const marks = trimmed.match(/^(?:\/{2,}\s*)+/)[0];
                lines[i] = marks.replace(/\s+/g, ' ').trim() + ' ' + body;
            } else {
                // 規則5: その他のコメントだけの行は位置を変えない
                lines[i] = line.replace(/\s+$/, '');
            }
            continue;
        }

        pendingBrackets = 0;
        const at = findComment(line);
        if (at < 0) { lines[i] = line.replace(/\s+$/, ''); continue; }

        // 規則3の下ごしらえ: コードとコメントに割って覚えておく（桁は後でまとめて決める）
        trailing.push({
            index: i,
            code: line.slice(0, at).replace(/\s+$/, ''),
            comment: line.slice(at).replace(/\s+$/, ''),
        });
        lines[i] = null;   // 目印。後で埋める
    }

    // 空行がひとつでも挟まっていれば、別のブロックとみなす
    const blankBetween = (a, b) => {
        for (let k = a + 1; k < b; k++) if (lines[k] === '') return true;
        return false;
    };

    // 規則3: 空行で区切られたブロックごとに、行末コメントを同じ桁に揃える
    let g = 0;
    while (g < trailing.length) {
        let e = g;
        while (e + 1 < trailing.length
            && !blankBetween(trailing[e].index, trailing[e + 1].index)) e++;

        // 突出して長い行は基準から外す（外した行のコメントはコードの直後に置かれる）
        const lens = [];
        for (let k = g; k <= e; k++) lens.push(trailing[k].code.length);
        lens.sort((x, y) => y - x);
        while (lens.length > 1 && lens[0] - lens[1] >= OUTLIER) lens.shift();

        const col = Math.ceil((lens[0] + MINGAP) / TABSTOP) * TABSTOP;

        for (let k = g; k <= e; k++) {
            const t = trailing[k];
            const pad = t.code.length < col ? col - t.code.length : MINGAP;
            lines[t.index] = t.code + ' '.repeat(pad) + t.comment;
        }
        g = e + 1;
    }

    fs.writeFileSync(file, lines.join('\n'));
}

// io.js は共通ブロックを持たないので対象外
const files = [];
for (const f of fs.readdirSync(ROOT).sort()) {
    if (f.endsWith('.js') && f !== 'io.js') files.push(path.join(ROOT, f));
}
for (const f of fs.readdirSync(path.join(ROOT, '文字列アルゴリズム')).sort()) {
    if (f.endsWith('.js') && f !== 'io.js') files.push(path.join(ROOT, '文字列アルゴリズム', f));
}
for (const f of files) alignFile(f);
console.log('整形: ' + files.length + ' ファイル');
