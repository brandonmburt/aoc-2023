/** https://adventofcode.com/2023/day/24 */

import { solve } from 'numeric'; // Unrewarding way to finish the year

interface Hailstone {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    slope: number;
    intercept: number; // Y-intercept
}

export function solvePuzzle24(input: string): [number, number] {

    const MIN = 200000000000000, MAX = 400000000000000;

    const arr: Hailstone[] = input.split('\n').map(line => line.replace(/\s/g, "")).map(s => {
        const [positions, velocities] = s.split('@');
        const [x, y, z] = positions.split(',').map(Number);
        const [vx, vy, vz] = velocities.split(',').map(Number);
        return { x, y, z, vx, vy, vz, slope: vy / vx, intercept: y - (vy / vx) * x};
    });
    
    let part1 = 0;
    for (let a=0; a<arr.length; a++) {
        for (let b=a+1; b<arr.length; b++) {
            const { slope: slope1, intercept: intercept1 } = arr[a], { slope: slope2, intercept: intercept2 } = arr[b];
            const x = (intercept2 - intercept1) / (slope1 - slope2);
            const y = slope1 * x + intercept1;
            if (x >= MIN && x <= MAX && y >= MIN && y <= MAX) {
                let valid = true;
                [arr[a], arr[b]].forEach(hailstone => {
                    let time = (x - hailstone.x) / hailstone.vx;
                    if (time < 0) valid = false;
                });
                if (valid) part1++;
            }
        }
    }

    const hailstones = arr.slice(0, 3).map(stone => [[stone.x, stone.y, stone.z], [stone.vx, stone.vy, stone.vz]]);
    const [[p1, v1], [p2, v2], [p3, v3]] = hailstones;

    const A = [
        [-(v1[1] - v2[1]), v1[0] - v2[0], 0, p1[1] - p2[1], -(p1[0] - p2[0]), 0],
        [-(v1[1] - v3[1]), v1[0] - v3[0], 0, p1[1] - p3[1], -(p1[0] - p3[0]), 0],
        [0, -(v1[2] - v2[2]), v1[1] - v2[1], 0, p1[2] - p2[2], -(p1[1] - p2[1])],
        [0, -(v1[2] - v3[2]), v1[1] - v3[1], 0, p1[2] - p3[2], -(p1[1] - p3[1])],
        [-(v1[2] - v2[2]), 0, v1[0] - v2[0], p1[2] - p2[2], 0, -(p1[0] - p2[0])],
        [-(v1[2] - v3[2]), 0, v1[0] - v3[0], p1[2] - p3[2], 0, -(p1[0] - p3[0])]
    ];
    
    const b = [
        [(p1[1] * v1[0] - p2[1] * v2[0]) - (p1[0] * v1[1] - p2[0] * v2[1])],
        [(p1[1] * v1[0] - p3[1] * v3[0]) - (p1[0] * v1[1] - p3[0] * v3[1])],
        [(p1[2] * v1[1] - p2[2] * v2[1]) - (p1[1] * v1[2] - p2[1] * v2[2])],
        [(p1[2] * v1[1] - p3[2] * v3[1]) - (p1[1] * v1[2] - p3[1] * v3[2])],
        [(p1[2] * v1[0] - p2[2] * v2[0]) - (p1[0] * v1[2] - p2[0] * v2[2])],
        [(p1[2] * v1[0] - p3[2] * v3[0]) - (p1[0] * v1[2] - p3[0] * v3[2])]
    ];

    const part2 = solve(A, b).slice(0, 3).reduce((acc, val) => acc + Math.round(val), 0);

    // 14046, 808107741406756
    return [part1, part2];

}