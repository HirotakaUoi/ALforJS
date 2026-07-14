#include <iostream>
#include <string>
using namespace std;

// ずらし表の作成
void CreateTable(string pattern, int table[]) {
    int patternLength = pattern.size();
    for (int i = 0; i < 256; i++) {
        table[i] = patternLength; // 初期化（デフォルトでパターンの長さに設定）
    }
    for (int i = 0; i < patternLength; i++) {
        table[(unsigned char)pattern[i]] = patternLength - i - 1;
    }
}

// Boyer-Moore-Horspool法による文字列検索
int BMHSearch(string target, string pattern) {
    int table[256];
    CreateTable(pattern, table);

    // 開始位置をパターン末尾に合わせる
    int i = pattern.size() - 1;
    int p = 0;

    while (i < target.size()) {
        // パターン末尾に位置を合わせる
        p = pattern.size() - 1;

        while (p >= 0 && i < target.size()) {
            if (target[i] == pattern[p]) {
                i--;
                p--;
            } else {
                break;
            }
        }
        // 一致判定
        if (p < 0) return i + 1;

        // 不一致の場合、ずらし表を参照し i を進める
        // ただし、今比較した位置より後の位置とする
        int shift1 = table[(unsigned char)pattern[p]];
        int shift2 = pattern.size() - p; // 比較を開始した地点の1つ後ろの文字
        i += max(shift1, shift2);
    }

    return -1; // 見つからなかった
}

int main() {
    string p, s;
    cout << "Input pattern string: ";
    cin >> p;
    cout << "Input string: ";
    cin >> s;
    int result = BMHSearch(s, p);
    if (result == -1)
        cout << "Pattern not matched!" << endl;
    else
        cout << "Pattern matched! at " << result << endl;

    return 0;
}