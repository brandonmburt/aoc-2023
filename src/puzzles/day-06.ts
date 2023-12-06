/** https://adventofcode.com/2023/day/6 */

export function solvePuzzle6(input: string): [number, number] {

    const [times, distances]: number[][] = input.split('\n').map(line => {
        return line.split(':')[1].trim().replace(/\s+/g, ' ').split(' ').map(Number);
    });
    let p1 = 1, p2 = 0;

    /** P1 */
    times.forEach((time, i) => {
        let dist = distances[i], ways = 0;
        for (let speed=0; speed<=time; speed++) {
            let remTime = time - speed;
            if (speed * remTime > dist) ways++;
        }
        p1 *= ways;
    });

    /** P2 */
    const time = +times.map(String).join(''), distance = +distances.map(String).join('');
    for (let speed=0; speed<=time; speed++) {
        let remTime = time - speed;
        if (speed * remTime > distance) p2++;
    }

    return [p1, p2];

}