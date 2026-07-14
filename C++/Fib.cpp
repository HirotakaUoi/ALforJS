#include <iostream>
using namespace std;

long f(int n) {
	// cout << "F=" << n << "\n";
	if (n==0) {
		return 0;
	} else if (n==1) {
		return 1;
	} else {
		return f(n-1)+f(n-2);
	}
}

int main(void) {	
	int n;
	cout << "Input number: ";
	cin >> n;
	
	cout << f(n) << "\n";
	return 0;
}
