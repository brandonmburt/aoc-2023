/** https://adventofcode.com/2023/day/2 */

export function solvePuzzle2(input: string): [number, number] {

    const shouldInvalidate = (color: string, n: number): boolean => {
        return (color === 'red' && n > 12) || (color === 'green' && n > 13) || (color === 'blue' && n > 14);
    }

    let p1 = 0, p2 = 0;
    input.split('\n').forEach((line) => {
        let isValid = true, minRed = 0, minGreen = 0, minBlue = 0;
        const [game, subsets] = line.split(': ');
        const id = +game.split(' ')[1];
        subsets.split('; ').forEach((subset) => {
            subset.split(', ').forEach(x => {
                const [quantity, color] = x.split(' ');
                if (shouldInvalidate(color, +quantity)) isValid = false;
                if (color === 'red') minRed = Math.max(minRed, +quantity);
                else if (color === 'green') minGreen = Math.max(minGreen, +quantity);
                else if (color === 'blue') minBlue = Math.max(minBlue, +quantity);
            });
        });
        if (isValid) p1 += id;
        p2 += (minRed * minGreen * minBlue);
    });
    
    return [p1, p2];

}