// 共通ブロックのブラウザ側 input() に、ページ上の入力欄（id="stdin"）からの読み取りを追加する
// （VSCode内蔵ブラウザなど window.prompt() が使えない環境向け。欄が空なら従来どおり prompt()）
const fs = require('fs');
const path = require('path');

const ROOT = '/Volumes/Dropbox/Dropbox/MyProjects/Claude/AL by JS for CC/Javascript';

const OLD = `    } else {
        const ans = window.prompt(msg);
        print(msg + ans + "\\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }`;

const NEW = `    } else {
        // ページに入力欄（id="stdin"）があり値が入っていれば、そこから1行ずつ読む
        // （VSCode内蔵ブラウザなど prompt() のダイアログが出ない環境向け）
        const box = document.getElementById('stdin');
        if (box && box.value.trim() !== '') {
            if (!window._stdin) window._stdin = { lines: box.value.split('\\n'), pos: 0 };
            const ans = (window._stdin.pos < window._stdin.lines.length)
                ? window._stdin.lines[window._stdin.pos++].trim() : '';
            print(msg + ans + "\\n");                // 端末のエコーの代わりに出力欄にも残す
            return ans;
        }
        const ans = window.prompt(msg);
        print(msg + ans + "\\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }`;

const targets = [];
for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.js')) targets.push(path.join(ROOT, f));
}
for (const f of fs.readdirSync(path.join(ROOT, '文字列アルゴリズム'))) {
    if (f.endsWith('.js')) targets.push(path.join(ROOT, '文字列アルゴリズム', f));
}

for (const file of targets) {
    let src = fs.readFileSync(file, 'utf8');
    if (!src.includes(OLD)) throw new Error('旧ブラウザ入力ブロックが見つからない: ' + file);
    src = src.replace(OLD, NEW);
    fs.writeFileSync(file, src);
    console.log('OK: ' + path.relative(ROOT, file));
}
console.log('total: ' + targets.length);
