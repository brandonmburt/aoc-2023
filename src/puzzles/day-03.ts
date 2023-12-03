/** https://adventofcode.com/2023/day/3 */

export function solvePuzzle3(input: string): [number, number] {

    const arr: string[][] = input.split('\n').map(x => x.split(''));
    const n = arr.length, m = arr[0].length;

    const getAdj = (row, col) => {
        return [
            [row-1, col],
            [row-1, col-1],
            [row-1, col+1],
            [row, col-1],
            [row, col+1],
            [row+1, col],
            [row+1, col-1],
            [row+1, col+1]
        ].filter(([x, y]) => x >= 0 && x < n && y >= 0 && y < m);
    }

    let p1 = 0, p2 = 0;
    const gearMap: Map<string, number> = new Map();

    arr.forEach((line, row) => {
        let col = 0;
        while (col < m) {
            if (!isNaN(+line[col])) {
                let coords = [[row, col]], numAsStr = line[col];
                while (col+1 < m && !isNaN(+line[col+1])) {
                    col++;
                    coords.push([row, col]);
                    numAsStr += line[col];
                }
                let adjCoords: number[][] = coords.flatMap(([row, col]) => getAdj(row, col));

                /** P1 */
                for (let i=0; i<adjCoords.length; i++) {
                    const [x, y] = adjCoords[i];
                    if (isNaN(+arr[x][y]) && arr[x][y] !== '.') {
                        p1 += +numAsStr;
                        break;
                    }
                }

                /** P2 */
                let coordSet: Set<string> = new Set();
                for (let i=0; i<adjCoords.length; i++) {
                    const [x, y] = adjCoords[i];
                    if (arr[x][y] === '*') coordSet.add(adjCoords[i].map(String).join(','));
                }
                coordSet.forEach(x => {
                    if (gearMap.has(x)) p2 += gearMap.get(x) * +numAsStr;
                    else gearMap.set(x, +numAsStr);
                });

            }
            col++;
        }
    });

    return [p1, p2];

}