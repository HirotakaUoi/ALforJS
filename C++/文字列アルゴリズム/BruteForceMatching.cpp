#include <iostream>
#include <string>
using namespace std;

int BruteForce(string p, string s) {
    bool matched;
    for (int i = 0; i <= s.size() - p.size(); i++) {
        matched = true;
        for (int j = 0; j < p.size(); j++) {
            cout << "s[" << i + j << "]=" << s[i + j] << ",  p[" << j << "]=" << p[j] << "\n";
            if (s[i + j] != p[j]) {
                matched = false;
                break;
            }
        }
        if (matched)return i;
    }
    return -1;
}

int main(void) {
    string p, s;

    cout << "Input pattern string: ";
    cin >> p;
    cout << "Input string: ";
    cin >> s;
    cout << "0123456789012345678901234567890123456789" << endl;
    cout << s << endl;
    int result = BruteForce(p, s);
    if (result == -1)
        cout << "Pattern not matched!\n";
    else
        cout << "Pattern matched! at " << result << "\n";
    return 0;
}