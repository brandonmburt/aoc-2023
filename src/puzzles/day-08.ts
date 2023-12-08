/** https://adventofcode.com/2023/day/8 */

export function solvePuzzle8(input: string): [number, number] {
    
    let arr = input.split('\n');
    const instructions = arr.shift().split('');
    arr.shift();

    const pathMap = new Map(), nodes = [];
    arr.forEach(line => {
        const [id, paths] = line.split(' = ');
        const [left, right] = paths.substring(1, paths.length-1).split(', ');
        pathMap.set(id, { L: left, R: right });
        if (id[2] === 'A') nodes.push(id);
    });

    let index = 0, maxIndex = instructions.length-1;
    const nextIndex = () => index === maxIndex ? 0 : index + 1;

    /** P1 */
    let p1 = 0, curr = 'AAA', dest = 'ZZZ';
    while (curr !== dest) {
        p1++;
        curr = pathMap.get(curr)[instructions[index]];
        index = nextIndex();
    }

    /** P2 */
    let cycles: number[] = nodes.reduce((acc, node) => {
        let first = null, second = null, i = 0;
        index = 0; // reset instruction index
        while (second === null) {
            i++;
            node = pathMap.get(node)[instructions[index]];
            index = nextIndex();
            if (node[2] !== 'Z') continue;
            else if (first === null) first = i;
            else second = i;
        }
        acc.push(second-first);
        return acc;
    }, []);

    // Calculate the greatest common divisor (GCD) using Euclid's algorithm
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    // Calculate the least common multiple (LCM)
    const lcm = (a: number, b: number): number =>  (a * b) / gcd(a, b);
        
    const p2: number = cycles.reduce(lcm);

    // 19199, 13663968099527
    return [p1, p2];

}