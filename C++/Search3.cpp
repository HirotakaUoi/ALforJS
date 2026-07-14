#include <iostream>
using namespace std;

int main(void) {
	    
    int s[] = {0, 1, 2, 4, 5, 7, 8, 9};
	int const N = 8;
    int d, i;
	
    cout << "Input search number: ";
    cin >> d;
    
    for (i=0; i<N; i++) {
		if (d <= s[i]) 
			break;
	}

	if ( (i<N) && (d==s[i] ) ) {		// dが見つかったなら…
        cout << "Found: " << d << " at index " << i << "\n";
    } else {
		cout << "I can't find: " << d << "\n";
	}
	return 0;
}