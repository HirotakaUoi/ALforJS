#include <cstdio>
#include <cstdlib>
#include <utility>
#include <iostream>

using namespace std;

void swap(int s[], int i, int j) {
	int temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

void bitonicsort(int lgn, int *ary) {
    for(int fb=1; fb<=lgn; fb++) {
        for(int sb=fb-1; sb>=0; sb--) {
            // this loop can be parallelized
            for(int i = 0; i < (1<<lgn); i++) {
                if((i>>fb)&1^(i>>sb)&1 && ary[i] < ary[i^(1<<sb)]) {
                    swap(ary, i, i^(1<<sb));
                }
            }
        }
    }
}

int main(int argc, char **argv)
{
    srand(10000);
    int lgn = 10;
	int *ary = new int[1<<lgn];
	cout << (1<<lgn);
    for(int i = 0; i < (1<<lgn); i++) {
        ary[i] = rand()%10000;
    }
    bitonicsort(lgn, ary);
    for(int i = 0; i < (1<<lgn); i++) {
        printf("%d, ", ary[i]);
    }
    printf("\n");
    return 0;
}