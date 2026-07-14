#include <iostream>
using namespace std;

long fact(int n) {
	if (n==1) {
		return 1;
	} else {
		return n*fact(n-1);
	}
}

int main(void) {	
	int n;
	cout << "Input number: ";
	cin >> n;
	
	cout << fact(n) << "\n";
	return 0;
}
