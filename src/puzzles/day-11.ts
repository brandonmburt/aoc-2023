/** https://adventofcode.com/2023/day/11 */

export function solvePuzzle11(input: string): [number, number] {

    const image: string[][] = input.split('\n').map(x => x.split(''));
    const emptyRows = new Set(), emptyCols = new Set();
    for (let i=0; i<image.length; i++) emptyRows.add(i);
    for (let i=0; i<image[0].length; i++) emptyCols.add(i);

    image.forEach((row, i) => {
        row.forEach((col, j) => {
            if (col === '.') return;
            emptyRows.delete(i);
            emptyCols.delete(j);
        });
    });

    const rows = [...emptyRows.values()].map(Number), cols = [...emptyCols.values()].map(Number);
    const galaxies: number[][] = [];
    image.forEach((row, i) => {
        row.forEach((col, j) => {
            if (col === '#') galaxies.push([i, j]);
        });
    });
    const galaxyCount = galaxies.length;

    const solve = (n: number): number => {
        let res = 0;
        for (let i=0; i<galaxyCount; i++) {
            let [x, y] = galaxies[i];
            for (let j=i+1; j<galaxyCount; j++) {
                let [x2, y2] = galaxies[j];
                let [minX, maxX] = [x, x2].sort((a, b) => a-b), [minY, maxY] = [y, y2].sort((a, b) => a-b);
                res += (n * rows.filter(n => n > minX && n < maxX).length);
                res += (n * cols.filter(n => n > minY && n < maxY).length);
                res += maxY - minY + maxX - minX;
            }
        }
        return res;
    }

    // 9605127, 458191688761
    return [solve(1), solve(999999)];

}