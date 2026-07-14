#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

void bubbleSort(int s[], int const N) {
	int temp;
	for (int i=0; i<N-1; i++)
		for(int j=0; j<N-1; j++)
			if (s[j]>s[j+1]) {
				temp = s[j];
				s[j] = s[j+1];
				s[j+1] = temp;
			}
}
	
int main() {
	int arraySize;
	srand(time(NULL));

	cout << "Input array size: ";
	cin >> arraySize;
    int* s = new int[arraySize];
	int const N=arraySize;
    for (int i = 0; i < N; i++) {
		s[i] = (rand() % 10000);
	}
	for (int k=0; k<N-1; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	
	bubbleSort(s, N);
	for (int k=0; k<N; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	return 0;
}
