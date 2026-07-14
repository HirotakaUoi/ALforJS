#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

void swap(int s[], int i, int j) {
	int temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

void bitonicSort(int s[], int const N) {
    for(int fb=1; fb<=N; fb++) {
        for(int sb=fb-1; sb>=0; sb--) {
			// ここの繰り返しは並列実行可能!!
			for(int i = 0; i < (1<<N); i++) {
				cout << "fb= " << fb <<" sb= " << sb << " i= " << i << " i^(1<<sb)= " << (i^(1<<sb));
				cout << " (i>>fb)= " << (i>>fb) <<" (i>>sb)= "<< (i>>sb);
				if (((i>>fb)&1^(i>>sb)&1)) {
						cout << " C "<<" s[i]= " << s[i] << " s[i^(1<<sb)]= "
						<< s[i^(1<<sb)] << " " << (((i>>fb)&1^(i>>sb)&1)&& (s[i] < s[i^(1<<sb)]));
				}
				cout <<  "\n";
				if( ((i>>fb)&1^(i>>sb)&1) && (s[i] < s[i^(1<<sb)])) {
                    swap(s, i, i^(1<<sb));
                }
            }
        }
    }
}

int main() {
	int logArraySize;
	srand(time(NULL));

	cout << "Input array size by 2^N: ";
	cin >> logArraySize;
// ( n<<N は nのN bit左シフト == n*(2^N))
    int* s = new int[(1<<logArraySize)];
	int const N = logArraySize;
    for (int i = 0; i < (1<<logArraySize); i++) {
		s[i] = (rand() % 100);
	}
	for (int k=0; k<(1<<logArraySize); k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	
	bitonicSort(s, N);
	for (int k=0; k<(1<<logArraySize); k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}
