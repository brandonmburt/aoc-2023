/** https://adventofcode.com/2023/day/12 */

export function solvePuzzle12(input: string): [number, number] {

    const springs: string[] = [], p2Springs: string[] = [];
    const groups: number[][] = [], p2Groups: number[][] = [];
    let cache = {};

    const removeDoubleSpaces = (s: string): string => s.replace(/\.{2,}/g, '.');

    input.split('\n').forEach(row => {
        let arr = row.split(' ');
        let conditions = removeDoubleSpaces(arr[0]);
        let damagedGroups = arr[1].split(',').map(Number);
        springs.push(conditions + '.');
        groups.push(damagedGroups);
        p2Springs.push(removeDoubleSpaces(new Array(5).fill(conditions).join('?')));
        p2Groups.push(new Array(5).fill(damagedGroups).flat());
    });

    const solve = (s: string, groups: number[], i: number, gi: number, curr: number) => {
        const key = `${i}, ${gi}, ${curr}`;
        if (key in cache) return cache[key];
        if (i === s.length) {
            if (gi === groups.length && curr === 0) return 1;
            else if (gi === groups.length-1 && groups[gi] === curr) return 1;
            else return 0;
        }
        let res = 0;
        for (let c of ['.', '#']) {
            if (s[i] === c || s[i] === '?') {
                if (c === '.' && curr === 0) res += solve(s, groups, i+1, gi, 0);
                else if (c === '.' && curr > 0 && gi < groups.length && groups[gi] === curr) res += solve(s, groups, i+1, gi+1, 0);
                else if (c === '#') res += solve(s, groups, i+1, gi, curr+1);
            }
        }
        cache[key] = res;
        return res;
    }

    const puzzle = (springArr: string[], groupArr: number[][]): number => {
        return springArr.reduce((acc, spring, i) => {
            cache = {};
            return acc += solve(spring, groupArr[i], 0, 0, 0);
        }, 0);
    }

    // 7732, 4500070301581
    return [puzzle(springs, groups), puzzle(p2Springs, p2Groups)];

}