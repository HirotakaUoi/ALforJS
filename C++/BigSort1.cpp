#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

void bubbleSort(int s[], const int N) {
	int temp;

	for (int i=0; i<N-1; i++)
		for(int j=0; j<N-1; j++)
			if (s[j]>s[j+1]) {
				temp = s[j];
				s[j] = s[j+1];
				s[j+1] = temp;
			}
}

void selectionSort(int s[], int const N) {
	int min, temp;
	for (int i=0; i<N-1; i++) {
		// for (int k=0; k<N; k++) {
		// 	cout << s[k] << " ";
		// }
		// cout << "\n";
		min = i;
		for(int j=i+1; j<N; j++)
			if (s[min]>s[j])
				min = j;
		temp = s[i];
		s[i] = s[min];
		s[min] = temp;
	}
}

void insertionSort(int s[], int const N) {
	int j, temp;
	for (int i=0; i<N-1; i++) {
//		for (int k=0; k<N; k++) {
//			cout << s[k] << " ";
//		}
//		cout << "\n";
		j = i+1;
		while( (j>0) && (s[j-1]>s[j]) ) {
			temp = s[j];
			s[j] = s[j-1];
			s[j-1] = temp;
			j--;
		}
	}
}

void shellSort(int s[], int const N) {
	int temp, i, j, h;
	
	h=1;
	while (h<N)
		h = 3*h+1;
	h = (h-1)/3;
	
	while (h>0) {
//		cout << h << " : " ;
//		for (int x=0; x<N; x++) {
//			cout << s[x] << " ";
//		}
//		cout << "\n";
		for (i=h; i<N; i++) {
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

void qsort(int s[], int first, int last) {
	int pivot, i, j, temp;

//		for (int k=first; k<=last; k++) {
//			cout << s[k] << " ";
//		}
//		cout << "first= " << first << " last= " << last << "\n";

	if (first < last) {
		pivot =  s[last];
//			cout << "Pivot=" << pivot << "\n";
		i = first;
		j = last - 1;
		while (true) {
			while ( (i < last) && (s[i] < pivot) ) {
				i += 1;
			}
			while ( (j >= first) && (s[j] > pivot) ) {
				j -= 1;
			}
//			cout << "i= " << i << "j= " << j << "\n";
			if (i >= j) {
				break;
			}
			temp = s[i];
			s[i] = s[j];
			s[j] = temp;
			i += 1;
			j -= 1;
		}
		temp = s[i];
		s[i] = s[last];
		s[last] = temp;

//	for (int k=first; k<i; k++) {
//		cout << s[k] << " ";
//	}
//	cout << " Pivot=" << s[i] << " ";
//	for (int k=i+1; k<=last; k++) {
//		cout << s[k] << " ";
//	}
//	cout << "\n";

		qsort(s, first, i-1);
		qsort(s, i+1, last);
	}
}

void quickSort(int s[], const int N) {
	qsort(s, 0, N-1);
}

int main() {
	int arraySize;
	srand(time(NULL));

	cout << "Input array size: ";
	cin >> arraySize;
    int* s = new int[arraySize];
	int const N = arraySize;
    // for (int i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
// //	for (int k=0; k<N; k++) {
// //		cout << s[k] << " ";
// //	}
// //	cout << "\n";
	
	// cout << "BubbleSort Start!!\n";
	// bubbleSort(s, N);
	// cout << "BubbleSort End!!\n";
	// for (int k=0; k<N-1; k++) {
	// 	cout << s[k] << " ";
	// }
	// cout << "\n";
    // for (int i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
	// cout << "SelectionSort Start!!\n";
	// selectionSort(s, N);
	// cout << "SelectionSort End!!\n";
	
    // for (int i = 0; i < N; i++) {
	// 	// s[i] = (rand() % 1000000);
	// 	s[i] = 1000000-i;
	// }
	// cout << "InsertionSort Start!!\n";
	// insertionSort(s, N);
	// cout << "InsertionSort End!!\n";
	
	for (int i = 0; i < N; i++) {
		// s[i] = (rand() % 1000000);
		s[i] = 1000000-i;

	}
	cout << "ShellSort Start!!\n";
	shellSort(s, N);
	cout << "ShellSort End!!\n";

	// for (int i = 0; i < N; i++) {
	// 	s[i] = (rand() % 1000000);
	// }
	// cout << "QuickSort Start!!\n";
	// quickSort(s, N);
	// cout << "QuickSort End!!\n";

	return 0;
}
