#include <iostream>
#include <vector>
#include <thread>

using namespace std;

// 配列の分割
// int partition(vector<int>& arr, int first, int last) {
//     int pivot = arr[last];
//     int i = first - 1;

//     for (int j = first; j < last; ++j) {
//         if (arr[j] <= pivot) {
//             ++i;
//             swap(arr[i], arr[j]);
//         }
//     }
//     swap(arr[i + 1], arr[last]);
//     int pivotIndex = i + 1;

//     // 分割結果を表示（ピボットを一度だけ表示）
//     for (int k = first; k <= last; ++k) {
//         if (k == pivotIndex) {
//             cout << "Pivot=" << pivot << " ";
//         } else {
//             cout << arr[k] << " ";
//         }
//     }
//     cout << endl << flush;

//     return pivotIndex;
// }

// クイックソート（マルチスレッド版）
void parallelQuickSort(vector<int>& s, int first, int last) {
    int i, j, pivot, temp;

    if (first < last) {
        pivot = s[last];
        i = first;
        j = last - 1;
        while (true) {
            while ((i < last) && (s[i] < pivot)) {
                i += 1;
            }
            while ((j >= first) && (s[j] > pivot)) {
                j -= 1;
            }
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
        // 分割結果を表示（ピボットを一度だけ表示）
        for (int k = first; k <= last; ++k) {
            if (k == i) {
                cout << "Pivot=" << pivot << " ";
            } else {
                cout << s[k] << " ";
            }
        }
        cout << endl << flush;

        // スレッドを格納するベクタ
        vector<thread> threads;

        // 左側の部分配列を並列にソート
        threads.emplace_back([&s, first, i]() {
            parallelQuickSort(s, first, i - 1);
        });

        // 右側の部分配列を並列にソート
        threads.emplace_back([&s, i, last]() {
            parallelQuickSort(s, i + 1, last);
        });

        // すべてのスレッドの終了を待つ
        for (auto& th : threads) {
            if (th.joinable()) {
                th.join();
            }
        }
    }
}

int main() {
    vector<int> arr = { 4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100, -100, 2 };
    int n = arr.size();

    parallelQuickSort(arr, 0, n - 1);

    cout << "Final sorted array: ";
    for (int i = 0; i < n; ++i)
        cout << arr[i] << " ";
    cout << endl;

    return 0;
}
