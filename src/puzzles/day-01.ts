/** https://adventofcode.com/2023/day/1 */

export function solvePuzzle1(input: string): [number, number] {

    let arr = input.split('\n');
    const startingChars = new Set(['o', 't', 'f', 's', 'e', 'n']);
    const numMap = new Map([
        ['one', '1'],
        ['two', '2'],
        ['three', '3'],
        ['four', '4'],
        ['five', '5'],
        ['six', '6'],
        ['seven', '7'],
        ['eight', '8'],
        ['nine', '9']
    ]);

    const getVal = (line: string, i: number): string => {
        for (let len=3; len<=5; len++) {
            let subStr = line.substring(i, i + len);
            if (numMap.has(subStr)) return numMap.get(subStr);
        }
        return null;
    }

    /** P1 */
    const getInt = (arr: string[]): string => arr.find(c => !isNaN(+c));
    const p1 = arr.reduce((acc, line) => acc += +(getInt(line.split('')) + getInt(line.split('').reverse())), 0);

    /** P2 */
    const getCalibration = (line: string): number => {
        let leftI = line.split('').findIndex((c, i) => {
            if (!isNaN(+c)) return true;
            else if (startingChars.has(c) && getVal(line, i) !== null) return true;
        });
        let rightI = line.length-1;
        while (rightI >= 0) {
            if (!isNaN(+line[rightI]) || (startingChars.has(line[rightI]) && getVal(line, rightI) !== null)) break;
            else rightI--;
        }
        let l = +line[leftI] ? line[leftI] : getVal(line, leftI), r = +line[rightI] ? line[rightI] : getVal(line, rightI);
        return +(l + r);
    }
    const p2 = arr.reduce((acc, line) => acc += getCalibration(line), 0);

    return [p1, p2];

}