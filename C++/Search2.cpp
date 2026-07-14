#include <iostream>
using namespace std;

int main(void) {
    int s[] = {4, 5, 2, 8, 7, 1, 9, 0, 99999};  //配列の最後にとりあえず 99999 を置いておく
    int const N = 8;  // 99999は除いた大きさ
    int d;

    cout << "Input search number: ";
    cin >> d;
    s[N] = d;         //配列の最後(99999の位置)にdを置く

    int i = 0;
    while (s[i] != d) i++;
    if (i == N) {     //iが配列の最後を指していたら…
        cout << "I can't find: " << d << "\n";
    } else {
        cout << "Found: " << d << " at index " << i << "\n";
    }
    return 0;
}