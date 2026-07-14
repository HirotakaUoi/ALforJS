#include <iostream>
using namespace std;

void shuffle(int s[], const int N) {
    int k, temp;

    srand(time(NULL));

    for (int i = N - 1; i > 0; --i) {
        k = rand() % (i + 1);
        temp = s[i];
        s[i] = s[k];
        s[k] = temp;
    }
}

void bogoSort(int s[], const int N) {
    int count = 1;
    bool swapped;

    while (true) {
        for (int k = 0; k < N; k++) {
            cout << s[k] << " ";
        }
        cout << "Count=" << count++ << "\n";
        swapped = false;
        for (int i = 0; i < N - 1; i++) {
            if (s[i] > s[i + 1]) {
                swapped = true;
                break;
            }
        }
        if (!swapped) break;
        shuffle(s, N);
    }
}

int main(void) {
    int s [] = { 4, 5, 2 };
    const int N=3;
    // int s [] = { 4, 5, 2, 9, 3 };
    // const int N=5;
    // int s [] = { 4, 5, 2, 7, 1, 9, 3 };
    // const int N=7;
    // int s[] = { 4, 5, 2, 8, 7, 1, 9, 3, 0 };
    // const int N=9;
    // int s[] = { 4, 5, 8, 2, 7, 1, 9, 0, 3, 10 };
    // const int N=13;

    bogoSort(s, N);
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";
    return 0;
}
//	int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
//	int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
