#include <iostream>
using namespace std;

void gnomeSort(int s[], const int N) {
    int i = 0;
    while (i < N) {
        for (int k = 0; k < N; k++) {
            cout << s[k] << " ";
        }
        cout << "\n";
        
        if (i == 0 || s[i-1] <= s[i]) {
            i++;
        } else {
            int temp = s[i];
            s[i] = s[i - 1];
            s[i - 1] = temp;
            i--;
        }
    }
}

int main(void) {
    // int s[] = {5, 4, 8, 2, 7, 0, 1};
    // const int N = 7;
    int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100, -100, 2};
    const int N = 19;

    gnomeSort(s, N);
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";
    return 0;
}
