#include <iostream>
using namespace std;

void bubbleSort(int s[], const int N) {
    int temp;
    for (int i = 0; i < N - 1; i++) {
        for (int k = 0; k < N; k++) {
            cout << s[k] << " ";
        }
        cout << "\n";
        for (int j = 0; j < N - 1; j++)
            if (s[j] > s[j + 1]) {
                temp = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp;
            }
    }
}

int main(void) {
    int s[] = {4, 5, 2, 8, 7, 1, 9, 3, 0};
    const int N = 9;
    // int s[] = {4, 5, 2, 8, 7, 1};
    // const int N = 6;
    // int s[] = {5, 4, 8, 2, 7, 0, 1};
    // const int N = 7;

    bubbleSort(s, N);
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";
    return 0;
}

//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
//	int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
// 100,-100,2};
