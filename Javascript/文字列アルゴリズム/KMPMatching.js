function makePartialMatchTable(pat) {
    // JSの配列は自動拡張されるため大きさの指定は不要
    // （C++のnew int[]と違い未設定の要素はundefinedになるので0で初期化しておく）
    const pmt = [];
    for (let k = 0; k < pat.length; k++) pmt[k] = 0;

    let j = 0;
    for (let i = 0; i < pat.length; i++) {
        if (i === 0) pmt[0] = -1;
        else if (i === 1) pmt[1] = 0;
        else if (pat[i - 1] === pat[j]) pmt[i] = ++j;
        else if (j > 0) j = pmt[j];
        else {
            pmt[i] = 0;
        }
    }
    return pmt;
}

function KMP(p, s) {
    let i, j;

    const pmt = makePartialMatchTable(p);
    for (let k = 0; k < p.length; k++) process.stdout.write(pmt[k] + " ");
    process.stdout.write("\n");
    process.stdout.write(p + "\n");
    process.stdout.write(s + "\n");

    i = 0;
    j = 0;
    while (i + j < s.length) {
        process.stdout.write("i=" + i + " i+j=" + (i + j) + " s[" + (i + j) + "]=" + s[i + j] + ", j=" + j + " p[" + j + "]=" + p[j] + " pmt[" + j + "]=" + pmt[j] + "\n");

        if (s[i + j] === p[j]) {
            j++;
            if (j === p.length) return i;
        } else {
            i = i + j - pmt[j];
            if (j > 0) j = pmt[j];
        }
    }
    return -1;
}

function main() {
    let p, s;
    // Console.Write("Input pattern string: ");
    // p = Console.ReadLine();
    // Console.Write("Input string: ");
    // s = Console.ReadLine();
    // p = "ABCDABD";
    // s = "ABC ABCDAB ABCDABCDABDE";
    p = "aaaaaab";
    s = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab";
    const result = KMP(p, s);
    if (result === -1)
        process.stdout.write("Pattern not matched!\n");
    else
        process.stdout.write("Pattern matched! at " + result + "\n");
}

main();
