#include <iostream>
using namespace std;

void insertionSort(int s[], const int N) {
	int j, temp;
	
	for (int i=0; i<N-1; i++) {
		for (int k=0; k<N; k++) {
			cout << s[k] << " ";
		}
		cout << "\n";
		j = i+1;
		while( (j>0) && (s[j-1]>s[j]) ) {
			temp = s[j];
			s[j] = s[j-1];
			s[j-1] = temp;
			j--;
		}
	}
}

int main(void) {
	int s[] = {4, 5, 2, 8, 7, 1, 9, 3, 0};
	int const N=9;
	// int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
	// int const N=13;

	insertionSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}


//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -1, -2};
//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
