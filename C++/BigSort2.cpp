#include <cstdlib>
#include <ctime>
#include <iostream>
using namespace std;

void bubbleSort(int s[], const int N) {
    int temp;
    for (int i = 0; i < N - 1; i++)
        for (int j = 0; j < N - 1; j++)
            if (s[j] > s[j + 1]) {
                temp = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp;
            }
}

void selectionSort(int s[], const int N) {
    int min, temp;
    for (int i = 0; i < N - 1; i++) {
        //		for (int k=0; k<N; k++) {
        //			cout << s[k] << " ";
        //		}
        //		cout << "\n";
        min = i;
        for (int j = i + 1; j < N; j++)
            if (s[min] > s[j]) min = j;
        temp = s[i];
        s[i] = s[min];
        s[min] = temp;
    }
}

void insertionSort(int s[], const int N) {
    int j, temp;
    for (int i = 0; i < N - 1; i++) {
        //		for (int k=0; k<N; k++) {
        //			cout << s[k] << " ";
        //		}
        //		cout << "\n";
        j = i + 1;
        while ((j > 0) && (s[j - 1] > s[j])) {
            temp = s[j];
            s[j] = s[j - 1];
            s[j - 1] = temp;
            j--;
        }
    }
}

void shellSort(int s[], const int N) {
    int temp, i, j, h;

    h = 1;
    while (h < N) h = 3 * h + 1;
    h = (h - 1) / 3;

    while (h > 0) {
        for (i = h; i < N; i++) {
            j = i;
            while ((j >= h) && (s[j - h] > s[j])) {
                temp = s[j];
                s[j] = s[j - h];
                s[j - h] = temp;
                j -= h;
            }
        }
        h = (h - 1) / 3;
    }
}

void mergeSort(int s[], const int N) {
    int msize = 1, i, j, k, base1, base2;
    int* b = new int[N];

    while (msize < N) {
        k = 0;
        base1 = 0;
        base2 = msize;
        while (base1 < N) {
            i = j = 0;
            while (true) {
                if ((i < msize) && (j < msize) && (base1 + i < N) &&
                    (base2 + j < N)) {
                    if (s[base1 + i] < s[base2 + j]) {
                        b[k] = s[base1 + i];
                        i++;
                        k++;
                    } else {
                        b[k] = s[base2 + j];
                        j++;
                        k++;
                    }
                } else if ((i < msize) && (base1 + i < N)) {
                    b[k] = s[base1 + i];
                    i++;
                    k++;
                } else if ((j < msize) && (base2 + j < N)) {
                    b[k] = s[base2 + j];
                    j++;
                    k++;
                } else {
                    break;
                }
            }
            base1 += 2 * msize;
            base2 += 2 * msize;
        }
        for (i = 0; i < N; i++) s[i] = b[i];
        //		for (int p=0; p<N; p++) {
        //			cout << s[p] << " ";
        //		}
        //		cout << "msize= " << msize << "\n";
        // ================  0 =============
        msize *= 2;
    }
}

void swap(int s[], int i, int j) {
    int temp = s[i];
    s[i] = s[j];
    s[j] = temp;
}

void insertHeap(int s[], int i) {
    while ((i > 0) && (s[i] > s[(i - 1) / 2])) {
        swap(s, i, (i - 1) / 2);
        i = (i - 1) / 2;
    }
}

void rebuildHeap(int s[], int max) {
    int i = 0;

    while (true) {
        if (i * 2 + 2 < max) {
            if (s[i * 2 + 1] > s[i * 2 + 2]) {
                if (s[i * 2 + 1] > s[i]) {
                    swap(s, i, i * 2 + 1);
                    i = i * 2 + 1;
                } else {
                    break;
                }
            } else {
                if (s[i * 2 + 2] > s[i]) {
                    swap(s, i, i * 2 + 2);
                    i = i * 2 + 2;
                } else {
                    break;
                }
            }
        } else if (i * 2 + 1 < max) {
            if (s[i * 2 + 1] > s[i]) {
                swap(s, i, i * 2 + 1);
                i = i * 2 + 1;
            } else {
                break;
            }
        } else {
            break;
        }
    }
}

void heapSort(int s[], const int N) {
    int i;
    for (i = 1; i < N; i++) {
        insertHeap(s, i);
        //		for (int k=0; k<N; k++) {
        //			cout << s[k] << " ";
        //		}
        //		cout << "\n";
    }

    for (i = 0; i < N - 1; i++) {
        swap(s, 0, N - 1 - i);
        rebuildHeap(s, N - 1 - i);
        //		for (int k=0; k<N; k++) {
        //			cout << s[k] << " ";
        //		}
        //		cout << "\n";
    }
}

void qsort(int s[], int first, int last) {
    int pivot, i, j, temp;

    //		for (int k=first; k<=last; k++) {
    //			cout << s[k] << " ";
    //		}
    //		cout << "first= " << first << " last= " << last << "\n";

    if (first < last) {
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

        //	for (int k=first; k<i; k++) {
        //		cout << s[k] << " ";
        //	}
        //	cout << " Pivot=" << s[i] << " ";
        //	for (int k=i+1; k<=last; k++) {
        //		cout << s[k] << " ";
        //	}
        //	cout << "\n";

        qsort(s, first, i - 1);
        qsort(s, i + 1, last);
    }
}

void quickSort(int s[], const int N) { qsort(s, 0, N - 1); }

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
            if (!swapped) break;
        } else {
            h = h * 10 / 13;
        }
        // for (int k=0; k<N; k++) {
        //     cout << s[k] << " ";
        // }
        // cout << "\n";
    }
}

int main() {
    int arraySize;
    srand(time(NULL));

    cout << "Input array size: ";
    cin >> arraySize;
    int* s = new int[arraySize];
    int* t = new int[arraySize];
    int* u = new int[arraySize];
    int* v = new int[arraySize];
    int* w = new int[arraySize];
    int* x = new int[arraySize];
    int* y = new int[arraySize];
    int* z = new int[arraySize];

    const int N = arraySize;
    for (int i = 0; i < N; i++) {
        s[i] = t[i] = u[i] = v[i] = w[i] = x[i] = y[i] = z[i] =
            (rand() % 10000000);
    }
    //	for (int k=0; k<N; k++) {
    //		cout << s[k] << " ";
    //	}
    //	cout << "\n";

    cout << "1/" << CLOCKS_PER_SEC << "sec unit\n";

    long startTime = clock();
    cout << "QuickSort Start:  " << startTime << "\n";
    quickSort(s, N);
    long endTime = clock();
    cout << "QuickSort End:    " << endTime << "\n";
    cout << "Processing Time = " << (endTime - startTime) << " μs\n\n";

    startTime = clock();
    cout << "CombSort Start: " << startTime << "\n";
    combSort(z, N);
    endTime = clock();
    cout << "CombSort End:   " << endTime << "\n";
    cout << "Processing Time = " << (endTime - startTime) << " μs\n\n";

    startTime = clock();
    cout << "HeapSort Start:   " << startTime << "\n";
    heapSort(t, N);
    endTime = clock();
    cout << "HeapSort End:     " << endTime << "\n";
    cout << "Processing Time = " << (endTime - startTime) << " μs\n\n";

    startTime = clock();
    cout << "MergeSort Start:  " << startTime << "\n";
    mergeSort(u, N);
    endTime = clock();
    cout << "MergeSort End:    " << endTime << "\n";
    cout << "Processing Time = " << (endTime - startTime) << " μs\n\n";

    startTime = clock();
    cout << "ShellSort Start:  " << startTime << "\n";
    shellSort(v, N);
    endTime = clock();
    cout << "ShellSort End:    " << endTime << "\n";
    cout << "Processing Time = " << (endTime - startTime) << " μs\n\n";

    // startTime = clock();
    // cout << "InsertionSort Start: " << startTime << "\n";
    // insertionSort(w, N);
    // endTime = clock();
    // cout << "InsertionSort End:   " << endTime << "\n";
    // cout << "Processing Time =    " << (endTime - startTime) << " μs\n\n";

    // startTime =clock();
    // cout << "SelectionSort Start: " << startTime  << "\n";
    // selectionSort(x, N);
    // endTime = clock();
    // cout << "SelectionSort End:   " << endTime << "\n";
    // cout << "Processing Time =    " << (endTime - startTime) << " μs\n\n";

    // startTime =clock();
    // cout << "BubbleSort Start: " << startTime  << "\n";
    // bubbleSort(y, N);
    // endTime = clock();
    // cout << "BubbleSort End:   " << endTime << "\n";
    // cout << "Processing Time = " << (endTime - startTime) << " μs\n\n";

    //	for (int k=0; k<N; k++) {
    //		cout << s[k] << " ";
    //	}
    //	cout << "\n";
    return 0;
}
