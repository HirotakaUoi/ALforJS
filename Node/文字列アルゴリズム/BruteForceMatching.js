// ====== 共通の入出力機能（変更しない）======
require("./io.js");
// ==========================================

function BruteForce(p, s) {
    let matched;
    for (let i = 0; i <= s.length - p.length; i++) {
        matched = true;
        for (let j = 0; j < p.length; j++) {
            output("s[" + (i + j) + "]=" + s[i + j] + ",  p[" + j + "]=" + p[j] + "\n");
            if (s[i + j] !== p[j]) {
                matched = false;
                break;
            }
        }
        if (matched) return i;
    }
    return -1;
}

async function main() {
    const p = await input("Input pattern string: ");
    const s = await input("Input string: ");
    output("0123456789012345678901234567890123456789\n");
    output(s + "\n");
    const result = BruteForce(p, s);
    if (result === -1)
        output("Pattern not matched!\n");
    else
        output("Pattern matched! at " + result + "\n");
}

main().finally(close);
