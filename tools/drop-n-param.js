// 配列の長さは配列自身から分かるので、N の受け渡しをやめる（一度きり）
//
// C++ では配列の大きさを別に渡す必要があるが、JS の配列は length を持っている。
//   ・main() の  const N = 9;  のような具体値を  const N = s.length;  にする
//   ・関数の引数から N を外し、関数の先頭で  const N = s.length;  として受け直す
//     （こうすると関数の中身は C++ 版のまま1文字も変わらない）
//
// 対象外:
//   ・BitonicSort1 / BitonicSort2 の N はビット幅（配列長の log2）で、長さではない
//   ・Search2 の N は番兵を除いた長さなので s.length - 1 にする
//
// 使い方: node tools/drop-n-param.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'Node');
const SUB = '文字列アルゴリズム';

// N が配列の長さではない関数（引数から外さない）
const KEEP_N = new Set(['bitonicSort']);

function convert(src, name) {
    let out = src;

    // ---- 1. 関数の引数から N を外し、先頭で s.length から受け直す ----
    const defs = [...out.matchAll(/^(async )?function\s+(\w+)\s*\(([^)]*)\)\s*\{/gm)]
        .map(m => ({ whole: m[0], async: m[1] || '', name: m[2], params: m[3] }))
        .filter(d => d.name !== 'main'
            && !KEEP_N.has(d.name)
            && d.params.split(',').map(s => s.trim())[1] === 'N'
            && d.params.split(',').map(s => s.trim())[0] === 's');

    for (const d of defs) {
        const rest = d.params.split(',').map(s => s.trim()).filter((_, i) => i !== 1);
        const sig = `${d.async}function ${d.name}(${rest.join(', ')}) {`;
        out = out.replace(d.whole, sig + '\n    const N = s.length;');

        // 呼び出し側（コメント行も含めて揃える）から2番目の引数 N を落とす
        const call = new RegExp('\\b' + d.name + '\\s*\\(([^),]+),\\s*N\\s*([,)])', 'g');
        out = out.replace(call, (m, a, tail) => d.name + '(' + a + (tail === ',' ? ',' : ')'));
    }

    // ---- 2. main() の const N = 具体値; を配列から計算する形にする ----
    if (name === 'Search2.js') {
        // 番兵つき。配列の最後の1つは探索対象に含めない
        out = out.replace(/^(\s*)const N = \d+;/m, '$1const N = s.length - 1;');
    } else {
        const mainPart = out.slice(out.indexOf('async function main'));
        const arr = mainPart.split('\n').filter(l => !l.trim().startsWith('//'))
            .find(l => /const\s+s\s*=\s*\[/.test(l));
        const nLine = mainPart.split('\n').filter(l => !l.trim().startsWith('//'))
            .find(l => /const\s+N\s*=\s*\d+\s*;/.test(l));
        if (arr && nLine) {
            const items = (arr.match(/\[([^\]]*)\]/) || [, ''])[1]
                .split(',').map(x => x.trim()).filter(x => x !== '').length;
            const nVal = Number((nLine.match(/const\s+N\s*=\s*(\d+)\s*;/) || [])[1]);
            if (items === nVal) {
                out = out.replace(nLine, nLine.replace(/const N = \d+;/, 'const N = s.length;'));
            }
        }
    }

    return out;
}

const files = [];
for (const f of fs.readdirSync(ROOT).sort()) {
    if (f.endsWith('.js') && f !== 'io.js') files.push([path.join(ROOT, f), f]);
}
for (const f of fs.readdirSync(path.join(ROOT, SUB)).sort()) {
    if (f.endsWith('.js') && f !== 'io.js') files.push([path.join(ROOT, SUB, f), f]);
}

let changed = 0;
for (const [p, name] of files) {
    const before = fs.readFileSync(p, 'utf8');
    const after = convert(before, name);
    if (after !== before) { fs.writeFileSync(p, after); changed++; }
}
console.log('最適化: ' + changed + ' / ' + files.length + ' ファイル');
