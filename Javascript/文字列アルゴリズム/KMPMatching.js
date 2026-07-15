// ====== 共通の入出力機能（変更しない）======
// Node.js・ブラウザ両対応の入出力
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（同期入力）
const isNode = (typeof window === 'undefined');

function print(s) {
    if (isNode) {
        process.stdout.write(String(s));
    } else {
        // appendChild(createTextNode) は追記のたびに全文をコピーしないため大量出力でも速い
        document.getElementById('output').appendChild(document.createTextNode(String(s)));
    }
}

function input(msg) {
    if (isNode) {
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
    } else {
        // ページに入力欄（id="stdin"）があり値が入っていれば、そこから1行ずつ読む
        // （VSCode内蔵ブラウザなど prompt() のダイアログが出ない環境向け）
        const box = document.getElementById('stdin');
        if (box && box.value.trim() !== '') {
            if (!window._stdin) window._stdin = { lines: box.value.split('\n'), pos: 0 };
            const ans = (window._stdin.pos < window._stdin.lines.length)
                ? window._stdin.lines[window._stdin.pos++].trim() : '';
            print(msg + ans + "\n");                // 端末のエコーの代わりに出力欄にも残す
            return ans;
        }
        const ans = window.prompt(msg);
        print(msg + ans + "\n");                    // 端末のエコーの代わりに出力欄にも残す
        return ans;
    }
}
// ==========================================

function makePartialMatchTable(pat) {
    // JSの配列は自動拡張されるため大きさの指定は不要
    // （C++のnew int[]と違い未設定の要素はundefinedになるので0で初期化しておく）
    const pmt = [];
    for (let k = 0; k < pat.length; k++) pmt[k] = 0;

    let j = 0;
    for (let i = 0; i < pat.length; i++) {
        if (i === 0) pmt[0] = -1;
        else if (i === 1) pmt[1] = 0;
        else if (pat[i - 1] === pat[j]) pmt[i] = ++j;
        else if (j > 0) j = pmt[j];
        else {
            pmt[i] = 0;
        }
    }
    return pmt;
}

function KMP(p, s) {
    let i, j;

    const pmt = makePartialMatchTable(p);
    for (let k = 0; k < p.length; k++) print(pmt[k] + " ");
    print("\n");
    print(p + "\n");
    print(s + "\n");

    i = 0;
    j = 0;
    while (i + j < s.length) {
        print("i=" + i + " i+j=" + (i + j) + " s[" + (i + j) + "]=" + s[i + j] + ", j=" + j + " p[" + j + "]=" + p[j] + " pmt[" + j + "]=" + pmt[j] + "\n");

        if (s[i + j] === p[j]) {
            j++;
            if (j === p.length) return i;
        } else {
            i = i + j - pmt[j];
            if (j > 0) j = pmt[j];
        }
    }
    return -1;
}

function main() {
    let p, s;
    // Console.Write("Input pattern string: ");
    // p = Console.ReadLine();
    // Console.Write("Input string: ");
    // s = Console.ReadLine();
    // p = "ABCDABD";
    // s = "ABC ABCDAB ABCDABCDABDE";
    p = "aaaaaab";
    s = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab";
    const result = KMP(p, s);
    if (result === -1)
        print("Pattern not matched!\n");
    else
        print("Pattern matched! at " + result + "\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
