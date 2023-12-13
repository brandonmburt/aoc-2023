/** https://adventofcode.com/2023/day/13 */

export function solvePuzzle13(input: string): [number, number] {

    const getRotatedMatrix = (patterns: string[][]) => {
        let m: string[][][] = patterns.map(x => x.map(y => y.split('')));
        return (m.map((matrix) => rotateMatrix(matrix)).map(m => m.map(arr => arr.join(''))));
    }

    function rotateMatrix(matrix: string[][]): string[][] {
        // Transpose the matrix
        const transposedMatrix: string[][] = matrix[0].map((_, colIndex) =>
            matrix.map((row) => row[colIndex])
        );

        // Reverse each row to complete the 90-degree clockwise rotation
        const rotatedMatrix: string[][] = transposedMatrix.map((row) => row.reverse());

        return rotatedMatrix;
    }

    const equalWithSmudge = (s1: string, s2: string): boolean => {
        let s1Arr = s1.split('');
        const idx = s1Arr.findIndex((c, i) => s1[i] !== s2[i]);
        if (idx === -1) return false;
        s1Arr[idx] = s1Arr[idx] === '.' ? '#' : '.';
        return s1Arr.join('') === s2;
    }

    const patterns: string[][] = input.split('\n\n').map(x => x.split('\n'));
    const rotatedPatterns: string[][] = getRotatedMatrix(patterns);

    const solve = (p2: boolean = false): number => {
        let sum = 0;
        [patterns, rotatedPatterns].forEach((pat, idx) => {
            const m = idx === 1 ? 1 : 100;
            pat.forEach(p => {
                const w = p[0].length;
                let below = p.reduce((acc, p) => acc += p, ''), above = '', res = 0;
                for (let i=0; i<p.length-1; i++) {
                    above = below.substring(0, w) + above, below = below.substring(w);
                    const aLen = above.length, bLen = below.length;
                    if (p2 === false) {
                        if (aLen === bLen) res = m * aLen / w;
                        else if (aLen > bLen && above.substring(0, bLen) === below) res = m * aLen / w;
                        else if (bLen > aLen && below.substring(0, aLen) === above) res = m * aLen / w;
                    } else {
                        if (aLen === bLen && equalWithSmudge(above, below)) res = m * aLen / w;
                        else if (aLen > bLen && equalWithSmudge(above.substring(0, bLen), below)) res = m * aLen / w;
                        else if (bLen > aLen && equalWithSmudge(below.substring(0, aLen), above)) res = m * aLen / w;
                    }
                    if (res !== 0) break;
                }
                sum += res;
            });
        });
        return sum
    }

    // 27202, 41566
    return [solve(), solve(true)];

}