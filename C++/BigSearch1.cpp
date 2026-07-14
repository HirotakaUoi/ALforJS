#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

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

	for (int k=first; k<i; k++) {
		cout << s[k] << " ";
	}
	cout << " Pivot=" << s[i] << " ";
	for (int k=i+1; k<=last; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";

		qsort(s, first, i-1);
		qsort(s, i+1, last);
	}
}

void quickSort(int s[], int const N) {
	qsort(s, 0, N-1);
}

int search1(int s[], int const N, int d) {
    for (int i=0; i<N; i++) {
      if (d == s[i]) {
        cout << "Found: " << d << " at index " << i << "\n";
        return 0;
      }
    }
	cout << "I can't find: " << d << "\n";
	return 0;
}

int bsearch1(int s[], int const N, int d) {
	int i, first, last, center;
	first=0;
	last=N-1;
	while( first <= last ) {				  	// �T���͈͂���łȂ���
		center = (first+last)/2;			// �͈͂̐^�񒆂��v�Z
		if (d == s[center]) {			// �͈͂̐^�񒆂̒l�����Ɠ�����
			cout << "Found: " << d << " at index " << center << "\n";
			return 0;
		} else if (d < s[center]) {		// �͈͂̐^�񒆂̒l�������傫��
			last = center - 1;			// �͈͂̌㔼�����Ȃ�
		} else {							// �͈͂̐^�񒆂̒l������菬����
			first = center + 1; 			// �͈͂̑O�������Ȃ�
		}
	}
	cout << "I can't find: " << d << "\n";
	return 0;
}


int main() {
	int arraySize, d;
	srand(time(NULL));

	cout << "Input array size: ";
	cin >> arraySize;
    int* s = new int[arraySize];
	int const N=arraySize;
    for (int i = 0; i < N; i++) {
		s[i] = (rand() % 100000);
	}
	quickSort(s, N);
	for (int k=0; k<N-1; k++) {
		cout << s[k] << " ";
	}
	cout << "\n";
	
	cout << "Input search number: ";
	cin >> d;
	
	search1(s, N, d);
	bsearch1(s, N, d);
	return 0;
}
