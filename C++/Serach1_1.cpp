#include <iostream>
using namespace std;

int main(void) {
    int s[] = {4, 5, 2, 8, 7, 1, 9, 0};
    const int N = 8;    //配列の大きさをNという定数にする
    int d;
    cout << "Input search number: ";  //入力タイミングの提示
    cin >> d;

    for (int i = 0; i < N; i++) {
        if (d == s[i]) {
            cout << "Found: " << d << " at index " << i << "\n";
            return 0;
        }
    }
    cout << "I can't find: " << d << "\n"; //少し丁寧な返事
    return 0;
}
