#include <iostream>
using namespace std;

void swap(int s[], int i, int j) {
	int temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

void insertHeap(int s[], int i) {
	while( (i>0) && (s[i]>s[(i-1)/2]) ) {
		swap(s, i, (i-1)/2);
		i = (i-1)/2;
	}
}

void rebuildHeap(int s[], int max) {
	int i=0;

	while( true ) {
		if( i*2+2 < max ) {
			if( s[i*2+1] > s[i*2+2] ) {
				if( s[i*2+1] > s[i] ) {
					swap(s, i, i*2+1);
					i = i*2+1;
				} else {
					break;
				}
			} else {
				if( s[i*2+2] > s[i] ) {
					swap(s, i, i*2+2);
					i = i*2+2;
				} else {
					break;
				}
			} 
		 } else if( i*2+1 < max ) {
			 if( s[i*2+1] > s[i] ) {
				swap(s, i, i*2+1);
				i = i*2+1;
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
	for( i=1; i<N; i++ ) {
		insertHeap(s, i);
		for (int k=0; k<N; k++) {
			cout << s[k] << " ";
		}
		cout << "\n";
	}

	for( i=0; i<N-1; i++ ) {
		swap(s, 0, N-1-i);
		rebuildHeap(s, N-1-i);
		for (int k=0; k<N; k++) {
			cout << s[k] << " ";
		}
		cout << "\n";
	}
}

int main() {
	// int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
	int s[] = {4, 5, 2, 8, 7, 10, 1, 11, 6, 3, 9, 12, -2};
		// int[] s = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
	const int N=13;
	
	heapSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}  
