#include <iostream>
using namespace std;

int main(void) {
    int d, i, first, last, center;
    int s[]     = {0, 1, 2, 4, 5, 7, 8, 9};
    int const N = 8;
    cout << "Input search number: ";
    cin >> d;
    first = 0;
    last  = N - 1;
    while (first <= last) { 				 // 探索範囲が空でない間
        cout << "First = " << first << ",Last = " << last << "\n";
        center = (first + last) / 2;  		 // 範囲の真ん中を計算
        if (d == s[center]) {  				// 範囲の真ん中の値がｄと等しい
            cout << "Found: " << d << " at index " << center << "\n";
            return 0;
        } else if (d < s[center]) {  		// 範囲の真ん中の値がｄより大きい
            last = center - 1;       		// 範囲の後半分を省く
        } else {  							// 範囲の真ん中の値がｄより小さい
            first = center + 1;  			 // 範囲の前半分を省く
        }
    }
    cout << "I can't find: " << d << "\n";
    return 0;
}
