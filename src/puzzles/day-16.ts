/** https://adventofcode.com/2023/day/16 */

interface Beam {
    row: number;
    col: number;
    dir: string; // R, L, U, D
}

export function solvePuzzle16(input: string): [number, number] {

    const grid: string[][] = input.split('\n').map(s => s.split('').map(t => t === '\\' ? 'BS' : t)); // Replace "\" with "BS"
    const height = grid.length, width = grid[0].length;
    const dirMap: Map<string, string> = new Map([
       ['R/', 'U'], ['L/', 'D'], ['U/', 'R'], ['D/', 'L'],
       ['RBS', 'D'], ['LBS', 'U'], ['UBS', 'L'], ['DBS', 'R']
    ]);

    const isValid = (row: number, col: number): boolean => row >= 0 && row < height && col >=0 && col < width;
    const coordToStr = (beam: Beam): string => `${beam.row},${beam.col}`;
    const getNextCoords = (beam: Beam): [number, number] => {
        const { row, col, dir } = beam;
        return dir === 'R' ? [row, col + 1] : dir === 'L' ? [row, col - 1] :
               dir === 'U' ? [row - 1, col] : dir === 'D' ? [row + 1, col] : null;
    }

    const solve = (p2: boolean = false): number => {
        let res = 0, possibleEntries: Beam[] = [];
        if (p2) {
            for (let w=0; w<width; w++) possibleEntries.push({ row: 0, col: w, dir: 'D' }, { row: height-1, col: w, dir: 'U' });
            for (let h=0; h<height; h++) possibleEntries.push({ row: h, col: 0, dir: 'R' }, { row: h, col: width-1, dir: 'L' });
        } else possibleEntries = [{ row: 0, col: 0, dir: grid[0][0] === 'BS' || grid[0][0] === '|' ? 'D' : 'R' }];

        possibleEntries.forEach(start => {
            let beams: Beam[] = [start];
            const operations: Set<string> = new Set(); // to avoid duplicate opterations
            const energized: Set<string> = new Set(); // tiles that have been visited
            while (beams.length > 0) {
                let next: Beam[] = [];
                beams.forEach((b: Beam) => {
                    const { dir } = b;
                    energized.add(coordToStr(b));
                    let [r, c] = getNextCoords(b);
                    if (isValid(r, c)) {
                        const tile = grid[r][c];
                        if (tile === '.') next.push({ row: r, col: c, dir: dir });
                        else if (tile === '|') {
                            if (dir === 'L' || dir === 'R') next.push({ row: r, col: c, dir: 'U' }, { row: r, col: c, dir: 'D' });
                            else next.push({ row: r, col: c, dir: dir });
                        } else if (tile === '-') {
                            if (dir === 'U' || dir === 'D') next.push({ row: r, col: c, dir: 'L' }, { row: r, col: c, dir: 'R' });
                            else next.push({ row: r, col: c, dir: dir });
                        } else if (tile === '/' || tile === 'BS') next.push({ row: r, col: c, dir: dirMap.get(`${dir}${tile}`) });
                    }
                });
                next = next.filter(b => !operations.has(`${b.row},${b.col},${b.dir}`));
                next.forEach(b => operations.add(`${b.row},${b.col},${b.dir}`));
                beams = next;
            }
            res = Math.max(res, energized.size);
        });
        return res;
    }

    // 7979, 8437
    return [solve(), solve(true)];

}