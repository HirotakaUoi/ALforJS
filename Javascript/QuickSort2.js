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

function qsort(s, first, last) {
    let pivot, i, j, temp, piv, mid;

    for (let k = first; k <= last; k++) {
        print(s[k] + " ");
    }
    print("first= " + first + " last= " + last + "\n");

    if (first < last) {
        if ((last - first) > 2) {
            mid = Math.floor((first + last) / 2);
            if (s[first] > s[last]) {
                if (s[last] > s[mid]) {
                    piv = last;
                } else if (s[first] > s[mid]) {
                    piv = mid;
                } else {
                    piv = first;
                }
            } else if (s[mid] < s[first]) {
                piv = first;
            } else if (s[last] > s[mid]) {
                piv = mid;
            } else {
                piv = last;
            }
            temp = s[piv];
            s[piv] = s[last];
            s[last] = temp;
        }
        pivot = s[last];
        //			print("Pivot=" + pivot + "\n");
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
            //			print("i= " + i + "j= " + j + "\n");
            if (i >= j) {
                break;
            }
            temp = s[i];
            s[i] = s[j];
            s[j] = temp;
            i += 1;
            j -= 1;
        }
        temp = s[i];
        s[i] = s[last];
        s[last] = temp;

        for (let k = first; k < i; k++) {
            print(s[k] + " ");
        }
        print(" Pivot=" + s[i] + " ");
        for (let k = i + 1; k <= last; k++) {
            print(s[k] + " ");
        }
        print("\n");

        qsort(s, first, i - 1);
        qsort(s, i + 1, last);
    }
}

function quickSort(s, N) { qsort(s, 0, N - 1); }

function main() {
    // const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1];
    //		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
    // 100,-100,2];
    // const N = 13;
    const arraySize = parseInt(input("Input array size: "), 10);
    const s = [];	// JSの配列は自動拡張されるため大きさの指定は不要
    const N = arraySize;
    for (let i = 0; i < N; i++) {
        // s[i] = (rand() % 10000000);
        s[i] = N - i;
    }

    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");

    quickSort(s, N);
    for (let k = 0; k < N; k++) {
        print(s[k] + " ");
    }
    print("\n");
}

if (isNode) main();      // ブラウザでは「実行」ボタンから main() を呼ぶ
