/** https://adventofcode.com/2023/day/9 */

export function solvePuzzle9(input: string): [number, number] {

    let p1 = 0, p2 = 0;
    input.split('\n').map(x => x.split(' ').map(Number)).forEach(row => {
        let firstElems = [row[0]], lastElems = [row[row.length-1]];
        while (row.some(n => n !== 0)) {
            let diffs = [];
            for (let i=0; i<row.length-1; i++) diffs.push(row[i+1] - row[i]);
            lastElems.push(diffs[diffs.length-1]);
            firstElems.push(diffs[0]);
            row = diffs;
        }
        p1 += lastElems.reduce((acc, n) => acc += n, 0);
        p2 += firstElems.reverse().reduce((acc, n) => acc = n - acc, 0);
    });

    // 1987402313, 900
    return [p1, p2];

}