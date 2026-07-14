// C言語の srand()/rand() 相当（シード付き線形合同法）
let _seed = 1;
function srand(seed) { _seed = seed >>> 0; }
function rand() {
    _seed = (Math.imul(_seed, 1103515245) + 12345) >>> 0;
    return (_seed >>> 16) & 0x7fff;
}

function swap(s, i, j) {
	const temp = s[i];
	s[i] = s[j];
	s[j] = temp;
}

function bitonicsort(lgn, ary) {
    for (let fb = 1; fb <= lgn; fb++) {
        for (let sb = fb - 1; sb >= 0; sb--) {
            // this loop can be parallelized
            for (let i = 0; i < (1 << lgn); i++) {
                if ((((i >> fb) & 1) ^ ((i >> sb) & 1)) && ary[i] < ary[i ^ (1 << sb)]) {
                    swap(ary, i, i ^ (1 << sb));
                }
            }
        }
    }
}

function main() {
    srand(10000);
    const lgn = 10;
    const ary = [];	// JSの配列は自動拡張されるため大きさの指定は不要
    process.stdout.write(String(1 << lgn));
    for (let i = 0; i < (1 << lgn); i++) {
        ary[i] = rand() % 10000;
    }
    bitonicsort(lgn, ary);
    for (let i = 0; i < (1 << lgn); i++) {
        process.stdout.write(ary[i] + ", ");
    }
    process.stdout.write("\n");
}

main();
