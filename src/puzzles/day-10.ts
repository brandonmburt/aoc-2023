/** https://adventofcode.com/2023/day/10 */

export function solvePuzzle10(input: string): [number, number] {

    let grid: string[][] = input.split('\n').map(x => x.split(''));
    const n = grid.length, m = grid[0].length;
    const pipes: Set<string> = new Set(['|', '-', 'L', 'J', '7', 'F']);
    const offsets: Record<string, number[][]> = {
        '|': [[-1, 0], [1, 0]],
        '-': [[0, -1], [0, 1]],
        'L': [[-1, 0], [0, 1]],
        'J': [[0, -1], [-1, 0]],
        '7': [[0, -1], [1, 0]],
        'F': [[0, 1], [1, 0]],
    };
    const connectsUp: Set<string> = new Set(['|', 'L', 'J']);
    const connectsDown: Set<string> = new Set(['|', '7', 'F']);
    const connectsRight: Set<string> = new Set(['-', 'L', 'F']);
    const connectsLeft: Set<string> = new Set(['-', 'J', '7']);

    const coordToStr = (x: number, y: number): string => [x, y].map(n => n.toString()).join(',');
    const isValidCoord = (x: number, y: number): boolean => x >= 0 && x < n && y >= 0 && y < m;

    const getAdjPipes = (x: number, y: number, pipe: string): number[][] => {
        return (offsets[pipe].map((c: number[]) => [c[0] + x, c[1] + y])).filter(c => {
            return isValidCoord(c[0], c[1]) && hasConnection([x, y], pipe, c, grid[c[0]][c[1]]);
        });
    }

    /** determine replacement value for 'S' */
    const findReplacementPipe = (x: number, y: number): string => {
        for (let pipe of ['|', '-', 'L', 'J', '7', 'F']) {
            if (getAdjPipes(x, y, pipe).length === 2) return pipe;
        }
    }

    const hasConnection = (coordA: number[], pipeA: string, coordB: number[], pipeB: string): boolean => {
        const [xA, yA] = coordA, [xB, yB] = coordB;
        if (xA === xB) {
            const leftPipe = yA < yB ? pipeA : pipeB, rightPipe = yA < yB ? pipeB : pipeA;
            return connectsRight.has(leftPipe) && connectsLeft.has(rightPipe);
        } else if (yA === yB) {
            const topPipe = xA < xB ? pipeA : pipeB, bottomPipe = xA < xB ? pipeB : pipeA;
            return connectsUp.has(bottomPipe) && connectsDown.has(topPipe);
        }
    }

    let startingCoord = '';
    grid.forEach((row, x) => {
        row.forEach((pipe, y) => {
            if (pipe === 'S') {
                startingCoord = coordToStr(x, y);
                grid[x][y] = findReplacementPipe(x, y);
            }
        });
    });
    
    const graph: Map<string, string[]> = new Map();
    grid.forEach((row, x) => {
        row.forEach((pipe, y) => {
            if (!pipes.has(pipe)) return;
            let adjNodes = getAdjPipes(x, y, pipe);
            if (adjNodes.length === 2) {
                let key = coordToStr(x, y);
                graph.set(key, adjNodes.map(x => coordToStr(x[0], x[1])));
            }
        });
    });

    /** P1 */
    let cycleKeys: Set<string> = new Set([startingCoord]), next = graph.get(startingCoord)[0];
    while (!!next && next !== startingCoord) {
        cycleKeys.add(next);
        next = graph.get(next)?.filter(c => !cycleKeys.has(c))[0] ?? null;
    }
    const p1 = cycleKeys.size % 2 === 1 ? (cycleKeys.size-1)/2 : cycleKeys.size/2;

    /** P2 */
    let p2 = 0;
    grid.forEach((row, x) => {
        let charCount = 0;
        row.forEach((pipe, y) => {
            if (cycleKeys.has(coordToStr(x, y))) charCount += ['|', 'J', 'L'].includes(pipe) ? 1 : 0;
            else p2 += charCount % 2 === 1 ? 1 : 0;
        });
    });

    // 6613, 511
    return [p1 , p2];

}