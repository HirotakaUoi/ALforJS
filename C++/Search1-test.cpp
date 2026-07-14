#include <iostream>
using namespace std;

int main(void) {
    int s[] = {3, 5, 2, 8, 7, 1, 9, 0, 10, 4};
    const int N = 10;
    int d;

    cout << "Input: ";
    cin >> d;

    for (int i = 0; i < N; i++) {
        if (d == s[i]) {
            cout << "Found at: " << i << endl; 
            return 0;
        }
    }
    cout << "I can't find" << endl;
    return 0;
}