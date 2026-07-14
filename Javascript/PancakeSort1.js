// リストの前からk+1個の要素を反転する関数
function flip(s, k) {
    for (let i = 0; i <= Math.floor(k / 2); i++) {
        const temp = s[i];
        s[i] = s[k - i];
        s[k - i] = temp;
    }
}

// Pancake Sortアルゴリズム
function pancakeSort(s, N) {
    for (let i = N; i > 1; --i) {
        // 最大要素のインデックスを探す
        let max_index = 0;
        for (let j = 1; j < i; ++j) {
            if (s[j] > s[max_index]) {
                max_index = j;
            }
        }

        // 最大要素が最後の位置にない場合に反転操作を行う
        if (max_index !== i - 1) {
            // 最大要素を先頭に持ってくる
            flip(s, max_index);
            for (let k = 0; k < N; k++) {
                process.stdout.write(s[k] + " ");
            }
            process.stdout.write("\n");

            // 最大要素を現在のサイズの最後に移動する
            flip(s, i - 1);
            for (let k = 0; k < N; k++) {
                process.stdout.write(s[k] + " ");
            }
            process.stdout.write("\n");
        }
    }
}

function main() {
    const s = [5, 4, 8, 2, 7, 0, 1];
    const N = 7;
    // const s = [4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,
    // -100, 2]; const N = 19;

    pancakeSort(s, N);

    // ソート後のリストを表示
    for (let k = 0; k < N; k++) {
        process.stdout.write(s[k] + " ");
    }
    process.stdout.write("\n");

    const t = [0, 1, 2, 3, 4, 5, 6];
    for (let t = 0; t < 7; t++) return;
}

main();
