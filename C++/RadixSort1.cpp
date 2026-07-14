#include <iostream>
#include <cstdlib>
#include <ctime>
#include <vector>
using namespace std;

void radixSort(int s[], const int N, const int max) {
    int i, j, k, n;

    vector<int> b[10];

    for (n = 1; n < max; n *= 10) {
        for (i = 0; i < 10; i++) b[i].clear();

        for (i = 0; i < N; i++)
            b[(s[i] / n) % 10].push_back(s[i]);

        for (k = 0; k < 10; k++) {
            cout << k << ": ";
            for (i = 0; i < b[k].size(); i++)
                printf("%03d ", b[k][i]);
            cout << "\n";
        }
        k = 0;
        for (j = 0; j < 10; j++)
            for (i = 0; i < b[j].size(); i++)
                s[k++] = b[j][i];
        for (k = 0; k < N; k++) {
            cout << s[k] << " ";
        }
        cout << endl;
    }
}

int main(void) {
    int s[] = { 345, 98, 302, 719, 804, 620, 183, 431, 572 };
    const int N = 9;
    // srand(time(NULL));
    // int s[20];
    // const int N = 20;
    // for (int i = 0; i < N; i++) {
    //     s[i] = (rand() % 1000);
    // }
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << endl;
    radixSort(s, N, 1000);
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << endl;
    return 0;
}
