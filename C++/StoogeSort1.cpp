#include <iostream>
using namespace std;

void stoogeSort(int s[], int i, int j) {
    if (s[i] > s[j]) {
        int temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }
    
    if (j - i + 1 > 2) {
        int t = (j - i + 1) / 3;
        stoogeSort(s, i, j - t);
        stoogeSort(s, i + t, j);
        stoogeSort(s, i, j - t);
    }
}

int main(void) {
    int s[] = {5, 4, 8, 2, 7, 0, 1};
    const int N = 7;

    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";

    stoogeSort(s, 0, N - 1);

    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";
    return 0;
}
