#include <iostream>
using namespace std;

void combSort(int s[], const int N) {
    int temp;
    int h = N * 10 / 13;
    bool swapped;

    while (true) {
        if (h == 9 || h == 10) h = 11;
        swapped = false;
        for (int i = 0; i + h < N; i++) {
            if (s[i] > s[i + h]) {
                temp = s[i + h];
                s[i + h] = s[i];
                s[i] = temp;
                swapped = true;
            }
        }
        if (h == 1) {
            if (!swapped)break;
        } else {
            h = h * 10 / 13;
        }
        for (int k=0; k<N; k++) {
            cout << s[k] << " ";
        }
        cout << "\n";
    }
}

int main(void) {
    // int s[] = {4, 5, 8, 2, 7, 1};
    // const int N=6;
    int s[] = { 4, 5, 2, 8, 7, 1, 9, 3, 0 };
    const int N=9;
    // int s[] = {4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1};
    // const int N=13;
    //	int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
	// const int N=19;
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	
	combSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}

//	int[] s = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
//	int[] s = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
