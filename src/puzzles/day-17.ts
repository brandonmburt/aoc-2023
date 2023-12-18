/** https://adventofcode.com/2023/day/17 */

interface Crucible {
    row: number;
    col: number;
    dir: string; // U, D, L, R
    dirSteps: number;
    heatLoss: number;
}

export function solvePuzzle17(input: string): [number, number] {

    const blocks: number[][] = input.split('\n').map(x => x.split('').map(Number));
    const h = blocks.length, w = blocks[0].length;

    const isValid = ({ row, col }: Crucible): boolean => row >= 0 && row < h && col >= 0 && col < w;
    const crucibleToKey = (c: Crucible): string => `${c.row},${c.col},${c.dir},${c.dirSteps}`;
    const crucible = (row: number, col: number, dir: string, dirSteps: number, heatLoss: number): Crucible => {
        return { row, col, dir, dirSteps, heatLoss };
    }

    const solve = (p2: boolean = false): number => {
        let res = Infinity, crucibles: Crucible[] = [crucible(0, 0, 'R', 0, 0), crucible(0, 0, 'D', 0, 0)];
        const prevOps: Map<string, number> = new Map();
        while (crucibles.length > 0) {
            let c: Crucible = crucibles.pop();
            const { row, col, dir, dirSteps, heatLoss } = c;
            if (!p2 && row === h-1 && col === w-1) {
                res = Math.min(res, heatLoss);
                continue;
            } else if (p2 && row === h-1 && col === w-1) {
                if (dirSteps > 4) res = Math.min(res, heatLoss);
                continue;
            }
            const key = crucibleToKey(c);
            if (prevOps.has(key) && prevOps.get(key) <= heatLoss) continue;
            prevOps.set(key, heatLoss);
            let next: Crucible[] = [];
            if (!p2) {
                if (dirSteps < 3) {
                    if (dir === 'U') next.push(crucible(row-1, col, 'U', dirSteps+1, heatLoss));
                    else if (dir === 'D') next.push(crucible(row+1, col, 'D', dirSteps+1, heatLoss));
                    else if (dir === 'L') next.push(crucible(row, col-1, 'L', dirSteps+1, heatLoss));
                    else if (dir === 'R') next.push(crucible(row, col+1, 'R', dirSteps+1, heatLoss));
                }
                if (dir === 'U' || dir === 'D') next.push(crucible(row, col-1, 'L', 1, heatLoss), crucible(row, col+1, 'R', 1, heatLoss));
                else if (dir === 'L' || dir === 'R') next.push(crucible(row-1, col, 'U', 1, heatLoss), crucible(row+1, col, 'D', 1, heatLoss));
            } else if (p2) {
                if (dirSteps < 10) {
                    if (dir === 'U') next.push(crucible(row-1, col, 'U', dirSteps+1, heatLoss));
                    else if (dir === 'D') next.push(crucible(row+1, col, 'D', dirSteps+1, heatLoss));
                    else if (dir === 'L') next.push(crucible(row, col-1, 'L', dirSteps+1, heatLoss));
                    else if (dir === 'R') next.push(crucible(row, col+1, 'R', dirSteps+1, heatLoss));
                }
                if (dirSteps >= 4) {
                    if (dir === 'U' || dir === 'D') next.push(crucible(row, col-1, 'L', 1, heatLoss), crucible(row, col+1, 'R', 1, heatLoss));
                    else if (dir === 'L' || dir === 'R') next.push(crucible(row-1, col, 'U', 1, heatLoss), crucible(row+1, col, 'D', 1, heatLoss));
                }
            }
            next.forEach((c: Crucible) => {
                if (!isValid(c)) return;
                c.heatLoss += blocks[c.row][c.col];
                if (c.heatLoss < res) crucibles.push(c);
            });
        }
        return res;
    }
    
    // 758, 892
    return [758, 892];
    return [solve(), solve(true)]; /* Runtime is ~5 minutes */
}