/** https://adventofcode.com/2023/day/18 */

export function solvePuzzle18(input: string): [number, number] {

    const dirShift = new Map([['U', [-1, 0]], ['D', [1, 0]], ['L', [0, -1]], ['R', [0, 1]]]);
    const dirLookup = new Map([[0, 'R'], [1, 'D'], [2, 'L'], [3, 'U']]);

    const solve = (p2: boolean = false): number => {

        const instructions: [string, number, string][] = input.split('\n').map(x => {
            const [dir, meters, hex] = x.split(' ');
            return [dir, +meters, hex.substring(2, hex.length-1)];
        });

        let [x, y] = [0, 0], edges = 0;
        const coords: number[][] = [[0, 0]];
        instructions.forEach(([dir, meters, hex]) => {
            if (p2) {
                dir = dirLookup.get(+hex[5]);
                meters = parseInt(hex.substring(0, 5), 16);
            }
            const [shiftX, shiftY] = dirShift.get(dir);
            edges += meters;
            [x, y] = [x + (meters * shiftX), y + (meters * shiftY)];
            coords.push([x, y]);
        });

        const calcPolygonArea = (coords: number[][]): number => {
            let area = 0;
            for (let i = 0; i < coords.length; i++) {
                const curr = coords[i], next = coords[(i + 1) % coords.length];
                area += curr[0] * next[1];
                area -= next[0] * curr[1];
            }
            area = Math.abs(area) / 2;
            return area;
        }

        const area = calcPolygonArea(coords);
        const interior = (area+1) - (edges/2); // Pick's theorem

        return interior + edges;
    }

    // 67891, 94116351948493
    return [solve(), solve(true)];

}