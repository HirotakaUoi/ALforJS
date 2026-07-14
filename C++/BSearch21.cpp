#include <iostream>
using namespace std;

int bsearch(int dst, int first, int last, int s[], int step) {
    cout << "First= " << first << " Last= " << last;
    if (first > last) {
        cout << "\n";
        return -1;
    }
    int center = (first + last) / 2;
    cout << " Center= " << center << "\n";

    if (dst == s[center]) {
        return center;
    } else if (dst < s[center]) {
        return bsearch(dst, first, center - 1, s, step + 1);
    } else {
        return bsearch(dst, center + 1, last, s, step + 1);
    }
}

int main(void) {
    int d;
    int s[]     = {0, 1, 2, 4, 5, 7, 8, 9};
    int const N = 8;
    cout << "Input search number: ";
    cin >> d;

    int res = bsearch(d, 0, N - 1, s, 0);
    if (res == -1) {
        cout << "I can't find: " << d << "\n";
    } else {
        cout << "Found: " << d << " at index " << res << "\n";
    }
    return 0;
}
