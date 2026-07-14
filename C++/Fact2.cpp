#include <iostream>
using namespace std;

long fact(int n) {
	long f=1;
	while( n>=1 ) { 
		f = n*f;
		n--;
	}
	return f;
}


int main() {	
	int n;
	cout << "Input number: ";
	cin >> n;
	
	cout << fact(n) << "\n";
	return 0;
}
