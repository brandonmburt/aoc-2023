/** https://adventofcode.com/2023/day/4 */

export function solvePuzzle4(input: string): [number, number] {

    let arr = input.split('\n'), p1 = 0;
    const cardCounts = new Array(arr.length).fill(1);

    arr.forEach((line, i) => {
        let numbers = line.split(':')[1];
        const [winningNums, myNums] = numbers.split('|').map(x => x.trim().replace(/\s{2,}/g, ' ').split(' ').map(Number));
        const winningSet = new Set(winningNums), evaluated = new Set();
        let points = 0;
        myNums.forEach(n => {
            if (!winningSet.has(n) || evaluated.has(n)) return;
            else {
                points = points === 0 ? 1 : points * 2;
                evaluated.add(n);
            }
        });
        p1 += points;
        for (let j=i+1; j<=i+evaluated.size; j++) cardCounts[j] += cardCounts[i];
    });

    return [p1, cardCounts.reduce((acc, n) => acc += n , 0)];

}