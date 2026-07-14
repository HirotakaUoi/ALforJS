#include <iostream>
using namespace std;

void qsort(int s[], int first, int last, int b[]) {
	int i, j, k;
	
//	cout << "Merge  " << first << " " << last << "    ";
//	for( int q=first; q<=last; q++)
//		cout << s[q] << " ";
//	cout << "\n";
	
	if( first < last ) {
		int center = (first+last)/2;
		qsort(s, first, center, b);
		qsort(s, center+1, last, b);
		
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
}

void mySort(int s[], int const N) {
	int *b = new int[N];
	qsort(s, 0, N-1, b);
}

int main() {
	int s[] = {4,6,2,8,7,10,8,1,9,3,0,-1,-2};
	int const N=13;
	
	mySort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}
