#include <iostream>
#include <string>
using namespace std;

int *makePartialMatchTable(string pat) {
    int* pmt = new int[pat.size()];

    int j = 0;
    for (int i = 0; i < pat.size(); i++) {
        if (i == 0) pmt[0] = -1;
        else if (i == 1) pmt[1] = 0;
        else if (pat[i - 1] == pat[j]) pmt[i] = ++j;
        else if (j > 0)j = pmt[j];
        else {
            pmt[i] = 0;
        }
    }
    return pmt;
}

int KMP(string p, string s) {
    int i, j;

    int *pmt = makePartialMatchTable(p);
    for (int k = 0; k < p.size(); k++) cout << pmt[k] << " ";
    cout << "\n";
    cout << p << "\n";
    cout << s << "\n";

    i = 0;
    j = 0;
    while (i + j < s.size()) {
        cout << "i=" << i << " i+j=" << i + j << " s[" << i + j <<"]=" << s[i + j] << ", j=" << j << " p[" << j << "]=" << p[j] << " pmt[" << j << "]=" << pmt[j] << "\n";

        if (s[i + j] == p[j]) {
            j++;
            if (j == p.size()) return i;
        } else {
            i = i + j - pmt[j];
            if (j > 0)j = pmt[j];
        }
    }
    return -1;
}

int main(void) {
    string p, s;
    // Console.Write("Input pattern string: ");
    // p = Console.ReadLine();
    // Console.Write("Input string: ");
    // s = Console.ReadLine();
    // p = "ABCDABD";
    // s = "ABC ABCDAB ABCDABCDABDE";
    p = "aaaaaab";
    s = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab";
    int result = KMP(p, s);
    if (result == -1)
        cout << "Pattern not matched!\n";
    else
        cout << "Pattern matched! at " << result << "\n";
    return 0;
}
