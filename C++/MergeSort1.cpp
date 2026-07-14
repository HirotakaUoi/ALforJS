#include <iostream>
using namespace std;

void mergeSort(int s[], const int N) {
	int msize=1, i, j, k, base1, base2;
	int* b = new int[N];
	
	while( msize < N ) {
		k = 0;
		base1 = 0;
		base2 = msize;
		while( base1 < N ) {
			i = j = 0;
			while( true ) {
				if( (i<msize) && (j<msize) && (base1+i<N) && (base2+j<N) ) {
					if( s[base1+i] < s[base2+j] ) {
						b[k] = s[base1+i];
						i ++;
						k ++;
					} else {
						b[k] = s[base2+j];
						j ++;
						k ++;
					}
				} else if( (i<msize) && (base1+i<N) ) {
					b[k] = s[base1+i];
					i ++;
					k ++;
				} else if( (j<msize) && (base2+j<N) ) {
					b[k] = s[base2+j];
					j ++;
					k ++;
				} else {
					break;
				}
			}
			base1 += 2*msize;
			base2 += 2*msize;
		}
		for( i=0; i<N; i++ )
			s[i] = b[i];
		for (int p=0; p<N; p++) {
			cout << s[p] << " ";
		}
		cout << "msize= " << msize << "\n";
		// ================  0 ============= 
		msize *= 2;
	}
}

int main() {
	// int s[] = {4, 5, 2, 3, 7, 10, 8, 1, 9, 6, 0, -1, -2};
	int s[] = {4, 5, -2, 7, 3, 10, 8, 1, 6, 9, 0, -1, 2};
	// int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
	const int N=13;
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	
	mergeSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}
