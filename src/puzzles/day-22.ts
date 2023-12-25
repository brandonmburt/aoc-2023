/** https://adventofcode.com/2023/day/22 */

interface Brick {
    id: number;
    x: number;
    y: number;
    z: number;
    dx: number;
    dy: number;
    dz: number;
    minZ: number;
    maxZ: number;
}

export function solvePuzzle22(input: string): [number, number] {

    const coordToStr = (x: number, y: number, z: number): string => `${x},${y},${z}`;

    const generateCoords = (b: Brick): number[][] => {
        let res: number[][] = [];
        for (let xVal = Math.min(b.x, b.dx); xVal <= Math.max(b.x, b.dx); xVal++) {
            for (let yVal = Math.min(b.y, b.dy); yVal <= Math.max(b.y, b.dy); yVal++) {
                for (let zVal = Math.min(b.z, b.dz); zVal <= Math.max(b.z, b.dz); zVal++) {
                    res.push([xVal, yVal, zVal]);
                }
            }
        }
        return res;
    }

    const isBlockedBelow = (coords: number[][], currZ: number): boolean => {
        return coords.find(([x, y, z]) => z === currZ && coordToBrickMap.has(coordToStr(x, y, z-1))) !== undefined;
    }

    const getTopCoords = (coords: number[][]): number[][] => {
        const maxZ: number = Math.max(...coords.map(c => c[2]));
        return coords.filter(c => c[2] === maxZ);
    }

    const getBottomCoords = (coords: number[][]): number[][] => {
        const minZLevel: number = Math.min(...coords.map(c => c[2]));
        return coords.filter(c => c[2] === minZLevel);
    }

    let bricks: Brick[] = input.split('\n').map((line, i) => {
        const [ x, y, z, dx, dy, dz ] = line.replace('~', ',').split(',').map(Number);
        return { id: i, x, y, z, dx, dy, dz, minZ: Math.min(z, dz), maxZ: Math.max(z, dz) };
    });

    const coordToBrickMap: Map<string, number> = new Map(), brickToCoordsMap: Map<number, number[][]> = new Map();

    for (let zLevel=1; zLevel<=Math.max(...bricks.map(b => b.maxZ)); zLevel++) {
        bricks.filter(b => b.minZ === zLevel).forEach(b => {
            let brickCoords: number[][] = generateCoords(b), currZ = zLevel;
            while (currZ > 1) {
                if (isBlockedBelow(brickCoords, currZ)) break;
                brickCoords = brickCoords.map(([x, y, z]) => [x, y, z - 1]);
                currZ--;
            }
            brickCoords.forEach(([x, y, z]) => coordToBrickMap.set(coordToStr(x, y, z), b.id));
            brickToCoordsMap.set(b.id, brickCoords);
        });
    }

    const bricksAboveMap = new Map(), bricksBelowMap = new Map(); // Used in P2
    let canDisintegrate: Set<number> = new Set();

    for (let [id, coords] of brickToCoordsMap) {
        let canDisintegrateBrick: boolean = true;
        const bricksAbove: Set<number> = new Set();
        getTopCoords(coords).forEach(([x, y, z]) => {
            const key = coordToStr(x, y, z+1);
            if (coordToBrickMap.has(key)) bricksAbove.add(coordToBrickMap.get(key));
        });
        bricksAbove.forEach(brick => {
            const bricksBelow: Set<number> = new Set();
            getBottomCoords(brickToCoordsMap.get(brick)).forEach(([x, y, z]) => {
                const below: string = coordToStr(x, y, z-1);
                if (coordToBrickMap.has(below)) bricksBelow.add(coordToBrickMap.get(below));
            });
            bricksBelowMap.set(brick, [...bricksBelow.values()]);
            if (bricksBelow.size === 1) canDisintegrateBrick = false;
        });
        if (canDisintegrateBrick) canDisintegrate.add(id);
        bricksAboveMap.set(id, [...bricksAbove.values()]);
    }

    // BEGIN P2
    let p2 = 0;
    for (let [id, coords] of brickToCoordsMap) {
        if (canDisintegrate.has(id)) continue;
        let toEval: number[] = [id];
        const fallenBricks: Set<number> = new Set([id]);
        while (toEval.length > 0) {
            let thisBrick = toEval.shift();
            bricksAboveMap.get(thisBrick).forEach(b => {
                if (bricksBelowMap.get(b).every(b2 => fallenBricks.has(b2))) {
                    fallenBricks.add(b);
                    toEval.push(b);
                }
            });
        };
        p2 += fallenBricks.size - 1;
    }

    // 441, 80778
    return [canDisintegrate.size, p2];

}