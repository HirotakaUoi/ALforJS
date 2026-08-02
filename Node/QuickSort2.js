// ====== 共通の入出力機能（Node.js専用・readline使用）======
// print(s)  : C++の cout << 相当（改行なし出力）
// input(msg): C++の cin >> 相当（内部で readline の Promise を await して返す。呼び出し側は await input(...)）
const readline = require('readline/promises');

function print(s) {
    process.stdout.write(String(s));
}

async function input(msg) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const line = await rl.question(msg);
    rl.close();
    return line.trim();
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

async function main() {
    // const s = [4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1];
    //		const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
    // 100,-100,2];
    // const N = 13;
    const arraySize = parseInt(await input("Input array size: "), 10);
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

main();
