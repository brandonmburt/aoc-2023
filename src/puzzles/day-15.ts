/** https://adventofcode.com/2023/day/15 */

interface Lens {
    label: string;
    focal: number;
}

export function solvePuzzle15(input: string): [number, number] {

    const hash = (curr: number, c: string): number => {
        curr = ((curr + c.charCodeAt(0)) * 17) % 256;
        return curr;
    }

    const getFocusingPower = (arr: Lens[], boxIndex: number): number => {
        let res = 0;
        arr.forEach((lens, i) => {
            let power = boxIndex * (i + 1) * (lens.focal);
            res += power;
        });
        return res;
    }

    const p1 = input.split(',').reduce((acc, step) => {
        return acc += step.split('').reduce((acc, c) => hash(acc, c), 0);
    }, 0);

    const boxes: Lens[][] = [];
    for (let i=0; i<256; i++) boxes.push([]);

    input.split(',').forEach((step, i) => {
        const operation: string = step.includes('=') ? '=' : '-';
        const label: string = step.split(operation)[0];
        const boxIndex: number = label.split('').reduce((acc, c) => acc = hash(acc, c), 0);
        if (operation === '-') {
            if (boxes[boxIndex].length !== 0 && boxes[boxIndex].find(lens => lens.label === label)) {
                const lensIndex = boxes[boxIndex].findIndex(lens => lens.label === label);
                boxes[boxIndex].splice(lensIndex, 1);
            }
        } else if (operation === '=') {
            const focal: number = +step.split('=')[1];
            if (boxes[boxIndex].length === 0 || !boxes[boxIndex].find(lens => lens.label === label)) {
                boxes[boxIndex].push({ label, focal });
            } else {
                const lenseIndex = boxes[boxIndex].findIndex(lens => lens.label === label);
                boxes[boxIndex][lenseIndex].focal = focal;
            }
        }
    });

    const p2 = boxes.reduce((acc, lens, i) => acc += getFocusingPower(lens, i+1), 0);

    // 504449, 262044
    return [p1, p2];

}