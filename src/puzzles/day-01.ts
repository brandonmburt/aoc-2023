/** https://adventofcode.com/2023/day/1 */

export function solvePuzzle1(input: string): [number, number] {

    let p1 = 0, p2 = 0, arr = input.split('\n');
    const startingChars = ['o', 't', 'f', 's', 'e', 'n'];

    const getVal = (line: string, i: number): string => {
        if (line.substring(i, i + 3) === 'one') return '1';
        else if (line.substring(i, i + 3) === 'two') return '2';
        else if (line.substring(i, i + 5) === 'three') return '3';
        else if (line.substring(i, i + 4) === 'four') return '4';
        else if (line.substring(i, i + 4) === 'five') return '5';
        else if (line.substring(i, i + 3) === 'six') return '6';
        else if (line.substring(i, i + 5) === 'seven') return '7';
        else if (line.substring(i, i + 5) === 'eight') return '8';
        else if (line.substring(i, i + 4) === 'nine') return '9';
        else return null;
    }

    /** P1 */
    arr.forEach((line) => {
        let leftI = 0, rightI = line.length - 1;
        while (leftI <= rightI && isNaN(+line[leftI])) leftI++;
        while (rightI >= 0 && isNaN(+line[rightI])) rightI--;
        p1 += +(line[leftI] + line[rightI]);
    });

    /** P2 */
    arr.forEach((line) => {
        let leftI = 0, rightI = line.length - 1, val = '';
        while (leftI <= rightI) {
            if (!isNaN(+line[leftI])) {
                val += line[leftI];
                break;
            } else if (startingChars.includes(line[leftI])) {
                let checkVal = getVal(line, leftI);
                if (checkVal) {
                    val += checkVal;
                    break;
                }
            }
            leftI++;
        }
        while (rightI >= 0) {
            if (!isNaN(+line[rightI])) {
                val += line[rightI];
                break;
            } else if (startingChars.includes(line[rightI])) {
                let checkVal = getVal(line, rightI);
                if (checkVal) {
                    val += checkVal;
                    break;
                }
            }
            rightI--;
        }
        p2 += +val;
    });

    return [p1, p2];

}