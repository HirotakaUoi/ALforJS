#include <iostream>
using namespace std;

void swap(int s[], int i, int j) {
	int temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

void bitonicSort(int s[], const int N) {
    for(int fb=1; fb<=N; fb++) {
        for(int sb=fb-1; sb>=0; sb--) {
			// ここの繰り返しは並列実行可能!!
            for(int i = 0; i < (1<<N); i++) {
                if( ((i>>fb)&1^(i>>sb)&1) && (s[i] < s[i^(1<<sb)])) {
//					swap(s, i, i^(1<<sb));
					int temp = s[i];
					s[i] = s[i^(1<<sb)]; 
					s[i^(1<<sb)] = temp;
                }
            }
        }
    }
}

int main() {
		int s[] = {4, 5, 2, 8, 6, 10, 11, 9, 3, 0, -1, -2, 1, 5, 7, 2};
//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
	const int N=4;
// ( n<<N は nのN bit左シフト == n*(2^N))
	for (int k=0; k<(1<<N); k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	
	bitonicSort(s, N);
	for (int k=0; k<(1<<N); k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}

