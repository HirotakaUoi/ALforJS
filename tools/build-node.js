// Javascript/ の両対応版（Node.js・ブラウザ両対応）から、Node.js専用版を生成して Node/ に出力する
// - 共通の入出力ブロック（print/input）からブラウザ分岐を除去
// - BigSort2.js の clock() からブラウザ分岐（performance.now）を除去
// - 末尾の `if (isNode) main();` を `main();` に
// 対象外: 両対応サンプル/（旧方式の参考用プロトタイプ）、html/（ブラウザ実行ページ）
// 再生成する場合: node tools/build-node.js
const fs = require('fs');
const path = require('path');

const SRC_ROOT = path.join(__dirname, '..', 'Javascript');
const DEST_ROOT = path.join(__dirname, '..', 'Node');
const EXCLUDE_DIRS = new Set(['html', '両対応サンプル'].map(s => s.normalize('NFC')));

const NODE_IO_BLOCK = `// ====== 共通の入出力機能（Node.js専用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
function print(s) {
    process.stdout.write(String(s));
}

function input(msg) {
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
        if (buf[0] === 10) break;               // '\n' が来たら1行の終わり
        bytes.push(buf[0]);
    }
    return Buffer.from(bytes).toString('utf-8').trim();
}
// ==========================================
`;

const IO_BLOCK_RE = /\/\/ ={6,} 共通の入出力機能[\s\S]*?\n\/\/ ={5,}\n?/;

const CLOCK_DUAL_RE = /\/\/ C\+\+の ?clock\(\)相当[\s\S]*?function clock\(\) \{\n[\s\S]*?\n\}\n/;

const NODE_CLOCK = `// C++のclock()相当：マイクロ秒を返す（Node.js専用：process.hrtime.bigint()をμs換算）
const CLOCKS_PER_SEC = 1000000;
function clock() {
    return Number(process.hrtime.bigint() / 1000n);
}
`;

function transform(src, file) {
    if (!IO_BLOCK_RE.test(src)) throw new Error('共通入出力ブロックが見つからない: ' + file);
    src = src.replace(IO_BLOCK_RE, NODE_IO_BLOCK);

    if (src.includes('function clock()')) {
        if (!CLOCK_DUAL_RE.test(src)) throw new Error('clock()の両対応ブロックが見つからない: ' + file);
        src = src.replace(CLOCK_DUAL_RE, NODE_CLOCK);
    }

    if (!src.includes('if (isNode) main();')) throw new Error('末尾の main() 呼び出しが見つからない: ' + file);
    src = src.replace(/if \(isNode\) main\(\);[^\n]*/, 'main();');

    if (src.includes('isNode')) throw new Error('isNode の消し残しあり: ' + file);
    return src;
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (EXCLUDE_DIRS.has(entry.name.normalize('NFC'))) continue;
            walk(path.join(dir, entry.name));
            continue;
        }
        if (!entry.name.endsWith('.js')) continue;

        const srcFile = path.join(dir, entry.name);
        const rel = path.relative(SRC_ROOT, srcFile);
        const destFile = path.join(DEST_ROOT, rel);

        const src = fs.readFileSync(srcFile, 'utf8');
        const out = transform(src, rel);

        fs.mkdirSync(path.dirname(destFile), { recursive: true });
        fs.writeFileSync(destFile, out);
        console.log('OK: ' + rel);
    }
}

walk(SRC_ROOT);
