/** https://adventofcode.com/2023/day/14 */

export function solvePuzzle14(input: string): [number, number] {

    const arr: string[][] = input.split('\n').map(x => x.split('')), arrP2 = [...arr.map(r => [...r])];

    const rotate = (a: string[][]): string[][] => {
        let res: string[][] = [];
        for (let i=0; i<a[0].length; i++) {
            let vals = [];
            a.forEach(row => vals.push(row[i]));
            res.push(vals);
        }
        return res;
    }

    const getTotal = (a: string[][]) => {
        let res = 0, n = a[0].length;
        rotate(a).forEach(col => col.forEach((c, i) => res += c === 'O' ? n - i : 0));
        return res;
    }

    const generateKey = (arr: string[][]): string => arr.flat().join('');

    const spinCycle = (a: string[][], p2: boolean = false) => {
        const height = a.length, width = a[0].length, directions = p2 ? ['N', 'W', 'S', 'E'] : ['N'];
        directions.forEach(dir => {
            if (dir === 'N' || dir === 'S') {
                const startingRow = dir === 'N' ? 0 : (height-1), inc = dir === 'N' ? -1 : 1;
                for (let row=startingRow; row>=0 && row<height; row-=inc) {
                    a[row].forEach((c, col) => {
                        if (c !== 'O') return
                        let destRow = row;
                        while (destRow+inc >= 0 && destRow < height && a[destRow+inc]?.[col] === '.') destRow += inc;
                        if (destRow !== row) {
                            a[destRow][col] = 'O';
                            a[row][col] = '.';
                        }
                    });
                }
            } else if (dir === 'W' || dir === 'E') {
                a.forEach(row => {
                    const startingCol = dir === 'W' ? 0 : (width-1), inc = dir === 'W' ? -1 : 1;
                    for (let col=startingCol; col>=0 && col<width; col-=inc) {
                        if (row[col] !== 'O') continue;
                        let destCol = col;
                        while (destCol+inc >= 0 && destCol < width && row[destCol+inc] === '.') destCol += inc;
                        if (destCol !== col) {
                            row[destCol] = 'O';
                            row[col] = '.';
                        }
                    }
                });
            }
        });
    }

    /** P1 */
    spinCycle(arr);
    const p1 = getTotal(arr);

    /** P2 */
    const DP = {}, totalCycles = 1000000000;
    let cycles = 0;
    while (cycles < totalCycles) {
        const key = generateKey(arrP2);
        if (key in DP) {
            if (DP[key].length === 1) DP[key].push(cycles);
            // Set cycles to the remainder after processing this loop
            cycles = totalCycles - ((totalCycles - cycles) % (DP[key][1] - DP[key][0]));
        }
        DP[key] = [cycles];
        spinCycle(arrP2, true);
        cycles++;
    }
    const p2 = getTotal(arrP2);

    // 109424, 102509
    return [p1, p2];

}