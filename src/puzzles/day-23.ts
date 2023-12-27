/** https://adventofcode.com/2023/day/23 */

export function solvePuzzle23(input: string): [number, number] {

    const arrows: string[] = ['^', '>', 'v', '<'];
    const grid: string[][] = input.split('\n').map(line => line.split(''));
    const H: number = grid.length, W: number = grid[0].length;
    const next = (x: number, y: number, c: string): number[][] => {
        return c === '^' ? [[x-1, y]] : c === '>' ? [[x, y+1]] : c === 'v' ? [[x+1, y]] : [[x, y-1]];
    }

    const coordToStr = (x: number, y: number): string => `${x},${y}`;
    const isForest = (x: number, y: number): boolean => grid[x][y] === '#';
    const getNeighbors = (x: number, y: number, prev: string = ''): number[][] => {
        const adj: number[][] = arrows.includes(prev) ? next(x, y, prev) : [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
        return adj.filter(([x, y]) => x >= 0 && x < H && y >= 0 && y < W && !isForest(x, y));
    }

    const [startX, startY]: number[] = [0, grid[0].findIndex(c => c === '.')];
    const [endX, endY]: number[] = [H-1, grid[H-1].findIndex(c => c === '.')];

    /** P1 */
    const dfsP1 = (x, y, visited: Set<string>, cost, max): number => {
        const key: string = coordToStr(x, y), char: string = grid[x][y];
        if (x === endX && y === endY) return Math.max(max, cost);
        else if (visited.has(key)) return;
        visited.add(key);
        const adj: number[][] = getNeighbors(x, y, char).filter(([x, y]) => !visited.has(coordToStr(x, y)));
        for (let [x, y] of adj) max = Math.max(max, dfsP1(x, y, visited, cost + 1, max));
        visited.delete(key);
        return max;
    }
    const p1 = dfsP1(startX, startY, new Set(), 0, 0);

    /** P2 */
    grid.forEach((row, x) => row.forEach((char, y) => { if (arrows.includes(char)) grid[x][y] = '.' } )); // Replace arrows with '.'

    const intersections: Set<string> = new Set([coordToStr(startX, startY), coordToStr(endX, endY)]);
    grid.forEach((row, x) => row.forEach((char, y) => {
        if (char === '.' && getNeighbors(x, y).length > 2) intersections.add(coordToStr(x, y));
    }));

    const shortcuts: Map<string, string> = new Map();
    intersections.forEach(key => {
        const [x, y]: number[] = key.split(',').map(Number);
        getNeighbors(x, y).forEach(([x, y]) => {
            const sourceKey: string = coordToStr(x, y);
            let visited: Set<string> = new Set([sourceKey]), cost = 0, [currX, currY] = [x, y];
            while (getNeighbors(currX, currY).filter(([aX, aY]) => !intersections.has(coordToStr(aX, aY)) && !visited.has(coordToStr(aX, aY))).length === 1) {
                const next: number[] = (getNeighbors(currX, currY).filter(([aX, aY]) => !intersections.has(coordToStr(aX, aY)) && !visited.has(coordToStr(aX, aY))))[0];
                visited.add(coordToStr(next[0], next[1]));
                currX = next[0];
                currY = next[1];
                cost++;
            }
            const destKey: string = coordToStr(currX, currY);
            shortcuts.set(sourceKey, destKey+','+cost);
        });
    });

    const relevantCoords: Set<string> = new Set([...intersections, ...shortcuts.keys()]);

    const getNextCoords = (x: number, y: number, visited: Set<string>): number[][] => {
        const key: string = coordToStr(x, y);
        let nextCoords: number[][] = getNeighbors(x, y).map(([x, y]) => [x, y, 1]);
        if (shortcuts.has(key)) {
            const [destX, destY, cost]: number[] = shortcuts.get(key).split(',').map(Number);
            nextCoords.push([destX, destY, cost]);
        }
        return nextCoords.filter(([x, y]) => relevantCoords.has(coordToStr(x, y)) && !visited.has(coordToStr(x, y)));
    }

    const dfsP2 = (x, y, visited: Set<string>, pathLen, longest): number => {
        const key: string = coordToStr(x, y);
        if (x === endX && y === endY) return Math.max(longest, pathLen);
        else if (visited.has(key)) return 0;
        visited.add(key);
        let nodes: number[][] = getNextCoords(x, y, visited);
        for (let n of nodes) {
            const [x, y, cost] = n;
            longest = Math.max(longest, dfsP2(x, y, visited, pathLen + cost, longest));
        }
        visited.delete(key);
        return longest;
    }
    const p2 = dfsP2(startX, startY, new Set(), 0, 0);

    // 2254, 6394 (p2 takes 6.5 minutes)
    return [p1, p2];

}