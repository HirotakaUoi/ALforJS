#include <iostream>
using namespace std;

void shellSort(int s[], int const N) {
	int temp, i, j, h;
	
	h=1;
	while (h<N)
		h = 3*h+1;
	h = (h-1)/3;
	
	while (h>0) {
		cout << h << " : " ;
		for (int x=0; x<N; x++) {
			cout << s[x] << " ";
		}
		cout << "\n";
		for (i=h; i<N; i++) {
			for (int x=0; x<N; x++) {
				cout << s[x] << " ";
			}
			cout << "\n";
			j = i;
			while( (j>=h) && (s[j-h]>s[j]) ) {
				temp = s[j];
				s[j] = s[j-h];
				s[j-h] = temp;
				j -= h;
			}
		}
		h = (h-1)/3;			
	}
}

int main() {
	int s[] = {8, 3, 4, 1, 7, 6, 9, 5, 0};
	int const N=9;
	// int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0, -2, -1, 6};
	// int const N=14;
	// int s[] = {4, 5, 2, 8, 7, 1, 9, 3, 0};
	// int const N=9;

	
	shellSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}  

//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
