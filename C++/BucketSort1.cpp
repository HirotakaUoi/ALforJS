#include <iostream>
using namespace std;

void bucketSort(int s[], const int N) {
	const int max=20; 
	int i, j;
	int* b = new int [max+1]; 
	
	for (j=0; j<=max; j++)
		b[j] = 0;
	for (i=0; i<N; i++)
		b[s[i]] += 1;
	for (int k=0; k<=max; k++) {
		cout << b[k] << " ";
	}
	cout << "Bucket \n";

	i = 0;
	for (j=0; j<=max; j++)
	while( b[j]>0 ) {
		s[i++] = j;
		b[j] -= 1;
	}		
}

int main() {
	// int s[] = { 4, 3, 1, 6, 5, 4, 2, 3, 0 };   // max=6
	//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, 9, 3, 0};
	int s[] = {4, 15, 2, 7, 10, 8, 1, 20, 14, 9, 3, 0, 12, 0, 2, 10};
	int const N=16;
	
	bucketSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	// cout << endl;
	return 0;
}  

