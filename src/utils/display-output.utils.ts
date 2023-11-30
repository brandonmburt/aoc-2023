export class DisplayUtils {

    public static print(day: number, ans1: any, ans2: any, ms: number): void {

        const d = ' Day ' + `${day}` + ' ';
        let a1 = '# Problem 1: ' + `${ans1}`;
        let a2 = '# Problem 2: ' + `${ans2}`;
        let r = '# Runtime: ' + `${ms.toFixed(3)}` + 'ms';
        const w = Math.max(a1.length, a2.length, r.length) + 2;

        let pad = '#'.repeat((w - d.length) / 2);
        let top = '\n' + pad + d + pad;
        top += ((w - d.length) % 2 === 1) ? '#\n' : '\n';

        a1 += ' '.repeat(w-2-a1.length) + ' #\n';
        a2 += ' '.repeat(w-2-a2.length) + ' #\n';
        r += ' '.repeat(w-2-r.length) + ' #\n';

        console.log(top + a1 + a2 + r + '#'.repeat(w));
    }

}
