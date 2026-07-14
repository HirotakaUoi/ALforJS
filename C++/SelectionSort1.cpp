#include <iostream>
using namespace std;

void selectionSort(int s[], int const N) {
	int min, temp;
	for (int i=0; i<N-1; i++) {
		for (int k=0; k<N; k++) {
			cout << s[k] << " ";
		}
		cout << "\n";
		min = i;
		for(int j=i+1; j<N; j++)
			if (s[min]>s[j])
				min = j;
		temp = s[i];
		s[i] = s[min];
		s[min] = temp;
	}
	
}

int main(void) {
	int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0,};
	// //		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
	int const N=11;
	// int s[] = {4, 5, 2, 8, 7, 1};
    // int const N = 6;

   	// int s[] = {5, 4, 8, 2, 7, 0, 1};
    // int const N = 7;


	selectionSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}
