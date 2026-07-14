#include <chrono>
#include <iostream>
#include <thread>
#include <vector>

using namespace std;

void sleepkSort(const int s[], const int N) {
    vector<thread> threads;

    for (int i = 0; i < N; ++i) {
        // ラムダ式を使用してスレッドを作成
        threads.push_back(thread([=]() {
            this_thread::sleep_for(chrono::seconds(s[i]));
            cout << s[i] << endl;
        }));
    }

    for (size_t i = 0; i < threads.size(); ++i) {
        threads[i].join(); // スレッドの終了を待つ
    }
}

int main() {
    int s[] = {30, 9, 5, 15, 8, 6, 1};
    const int N = 7;

    for (int k = 0; k < N; k++) {
        cout << s[k] << " ";
    }
    cout << "\n";

    sleepkSort(s, N);
    return 0;
}

// g++ -std=c++11 -pthread 