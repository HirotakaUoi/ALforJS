#include <iostream>
using namespace std;

// リストの前からk+1個の要素を反転する関数
void flip(int s[], int k) {
    for (int i = 0; i <= k / 2; i++) {
        int temp = s[i];
        s[i] = s[k - i];
        s[k - i] = temp;
    }
}

// Pancake Sortアルゴリズム
void pancakeSort(int s[], const int N) {
    for (int i = N; i > 1; --i) {
        // 最大要素のインデックスを探す
        int max_index = 0;
        for (int j = 1; j < i; ++j) {
            if (s[j] > s[max_index]) {
                max_index = j;
            }
        }

        // 最大要素が最後の位置にない場合に反転操作を行う
        if (max_index != i - 1) {
            // 最大要素を先頭に持ってくる
            flip(s, max_index);
            for (int k = 0; k < N; k++) {
                cout << s[k] << " ";
            }
            cout << "\n";

            // 最大要素を現在のサイズの最後に移動する
            flip(s, i - 1);
            for (int k = 0; k < N; k++) {
                cout << s[k] << " ";
            }
            cout << "\n";
        }
    }
}

int main(void) {
    int s[] = {5, 4, 8, 2, 7, 0, 1};
    const int N = 7;
    // int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,
    // -100, 2}; const int N = 19;

    pancakeSort(s, N);

    // ソート後のリストを表示
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";

    int t[] = {0, 1, 2, 3, 4, 5, 6};
    for (int t = 0; t < 7; t++) return 0;
}
