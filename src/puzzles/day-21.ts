/** https://adventofcode.com/2023/day/21 */

export function solvePuzzle21(input: string): [number, number] {

    const grid: string[][] = input.split('\n').map(x => x.split(''));
    const h = grid.length, w = grid[0].length;
    
    let sPos: number[] = null;
    grid.forEach((arr, row) => arr.forEach((val, col) => { if (val === 'S') sPos = [row, col] } ));
    grid[sPos[0]][sPos[1]] = '.';

    const isGardenPlot = (r: number, c: number): boolean => grid[r][c] === '.';
    const coordToStr = (r: number, c: number): string => `${r},${c}`;
    const strToCoord = (s: string): number[] => s.split(',').map(Number);

    const getAdj = (row: number, col: number, allowOverFlow: boolean = false): number[][] => {
        const adj = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([x, y]) => [row + x, col + y]);
        if (allowOverFlow) return adj;
        else return adj.filter(([x, y]) => x >= 0 && x < h && y >= 0 && y < w && isGardenPlot(x, y));
    }

    const fitCoordToGrid = (r: number, c: number): number[] => {
        let newRow = r % h, newCol = c % w;
        if (newRow < 0) newRow += h;
        if (newCol < 0) newCol += w;
        return [newRow, newCol];
    }

    const solveP1 = (steps: number): number => {
        let positions: Set<string> = new Set([coordToStr(sPos[0], sPos[1])]);
        for (let i=0; i<steps; i++) {
            let nextPositions: Set<string> = new Set();
            [...positions.values()].map(coord => strToCoord(coord)).forEach(([r, c]) => {
                getAdj(r, c).forEach(([x, y]) => nextPositions.add(coordToStr(x, y)));
            })
            positions = nextPositions;
        }
        return positions.size;
    }

    const solveP2 = (target: number): number => {
        const aVals: number[] = [sPos[0], sPos[0] + h, sPos[0] + (2 * h)].map(steps => {
            let active = 1;
            let visitedPositions: Set<string> = new Set([coordToStr(sPos[0], sPos[1])]);
            let currPositions: Set<string> = new Set([coordToStr(sPos[0], sPos[1])]);
            for (let i=0; i<steps; i++) {
                let nextPositions: Set<string> = new Set();
                const coords: number[][] = [...currPositions.values()].map(coord => strToCoord(coord));
                coords.forEach(([r, c]) => {
                    getAdj(r, c, true).filter(([x, y]) => !visitedPositions.has(coordToStr(x, y))).forEach(([x, y]) => {
                        const [gridRow, gridCol] = fitCoordToGrid(x, y);
                        if (grid[gridRow][gridCol] === '.') {
                            visitedPositions.add(coordToStr(x, y))
                            nextPositions.add(coordToStr(x, y));
                        }
                    });
                })
                currPositions = nextPositions;
                const newlyVisited = currPositions.size, totalVisited = visitedPositions.size;
                const previousVisitedCount = totalVisited - newlyVisited;
                active = newlyVisited + (previousVisitedCount - active);
            }
            return active;
        });

        const [ a0, a1, a2 ] = aVals;
        const b0 = a0, b1 = a1-a0, b2 = a2-a1;
        const n = Math.floor(target/h);

        return b0 + b1*n + (Math.floor(n*(n-1)/2))*(b2-b1);
    }    

    // 3598, 601441063166538
    return [solveP1(64), solveP2(26501365)];

}