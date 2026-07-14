#include <iostream>
using namespace std;

void merge(int s[], int first, int last, int b[]) {
	int i, j, k;
	
	cout << "Merge  " << first << " " << last << "    ";
	for( int q=first; q<=last; q++)
		cout << s[q] << " ";
	cout << "\n";
	
	if( first < last ) {
		int center = (first+last)/2;
		merge(s, first, center, b);
		merge(s, center+1, last, b);
		
		for(i=first; i<=center; i++)
			b[i] = s[i];
		for(i=center+1; i<=last; i++)
			b[last+center+1-i] = s[i];
		
		i = first;
		j = last;
		for(k=first; k<=last; k++)
			if( b[i]<b[j] ) {
				s[k] = b[i];
				i ++;
			} else {
				s[k] = b[j];
				j --;
			}
	}
	cout << "Merged " << first << " " << last << "    ";
	for( int q=first; q<=last; q++)
		cout << s[q] << " ";
	cout << "\n";

}

void mergeSort(int s[], int const N) {
	int *b = new int[N];
	merge(s, 0, N-1, b);
}

int main() {
	int s[] = {4, 5, 2, 3, 7, 10, 8, 1, 9, 6, 0, -1, -2};
//		int s[] = {4, 5, 2, 8, 7, 10, 8, 1, -10, -4, 9, 3, 0, 12, 0, 2, 100,-100,2};
	int const N=13;
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
