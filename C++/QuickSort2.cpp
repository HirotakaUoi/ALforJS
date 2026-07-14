#include <iostream>
using namespace std;

void qsort(int s[], int first, int last) {
    int pivot, i, j, temp, piv, mid;

    for (int k = first; k <= last; k++) {
        cout << s[k] << " ";
    }
    cout << "first= " << first << " last= " << last << "\n";

    if (first < last) {
        if ((last - first) > 2) {
            mid = (first + last) / 2;
            if (s[first] > s[last]) {
                if (s[last] > s[mid]) {
                    piv = last;
                } else if (s[first] > s[mid]) {
                    piv = mid;
                } else {
                    piv = first;
                }
            } else if (s[mid] < s[first]) {
                piv = first;
            } else if (s[last] > s[mid]) {
                piv = mid;
            } else {
                piv = last;
            }
            temp = s[piv];
            s[piv] = s[last];
            s[last] = temp;
        }
        pivot = s[last];
        //			cout << "Pivot=" << pivot << "\n";
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
            //			cout << "i= " << i << "j= " << j << "\n";
            if (i >= j) {
                break;
            }
            temp = s[i];
            s[i] = s[j];
            s[j] = temp;
            i += 1;
            j -= 1;
        }
        temp = s[i];
        s[i] = s[last];
        s[last] = temp;

        for (int k = first; k < i; k++) {
            cout << s[k] << " ";
        }
        cout << " Pivot=" << s[i] << " ";
        for (int k = i + 1; k <= last; k++) {
            cout << s[k] << " ";
        }
        cout << "\n";

        qsort(s, first, i - 1);
        qsort(s, i + 1, last);
    }
}

void quickSort(int s[], const int N) { qsort(s, 0, N - 1); }

int main(void) {
    // int s[] = {4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1};
    //		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2,
    // 100,-100,2};
    // const int N=13;
    int arraySize;
    cout << "Input array size: ";
    cin >> arraySize;
    int* s = new int[arraySize];
    const int N = arraySize;
    for (int i = 0; i < N; i++) {
        // s[i] = (rand() % 10000000);
        s[i] = N - i;
    }

    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";

    quickSort(s, N);
    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";
    return 0;
}
