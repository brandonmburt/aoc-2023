/** https://adventofcode.com/2023/day/5 */

export function solvePuzzle5(input: string): [number, number] {

    const arr: string[] = input.split('\n\n');
    const seeds: number[] = arr.shift().split(': ')[1].split(' ').map(Number);
    const maps: number[][][] = arr.map(info => info.split('\n').slice(1).map(x => x.split(' ').map(Number)));

    /** P1 */
    const locations: number[] = seeds.map(seed => {
        let location = seed;
        maps.forEach(mapDefinition => {
            for (let i=0; i<mapDefinition.length; i++) {
                const [destRangeStart, sourceRangeStart, rangeLength] = mapDefinition[i];
                if (location >= sourceRangeStart && location <= (sourceRangeStart + rangeLength - 1)) {
                    location = destRangeStart + (location - sourceRangeStart);
                    break;
                }
            }
        });
        return location;
    });

    /** P2 */
    const seedRanges: number[][] = [];
    for (let i=0; i<seeds.length; i+=2) seedRanges.push([seeds[i], seeds[i] + seeds[i+1] - 1]);
    const locationRanges: number[][] = seedRanges.flatMap((seedRange: number[]) => {
        let localRanges: number[][] = [seedRange];
        maps.forEach(mapDefinition => {
            let nextLocalRanges: number[][] = [];
            mapDefinition.forEach(([destRangeStart, sourceRangeStart, rangeLength]) => {
                const sourceRangeEnd = sourceRangeStart + rangeLength - 1;
                localRanges.forEach((localRange, i) => {
                    if (localRange === null || localRange == undefined) return;
                    const [localStart, localEnd] = localRange;
                    const offset = destRangeStart - sourceRangeStart;
                    if (localStart >= sourceRangeStart && localEnd <= sourceRangeEnd) { /** local range in source range */
                        nextLocalRanges.push(localRange.map(n => n + offset));
                        localRanges[i] = null;
                    } else if (localStart >= sourceRangeStart && localStart <= sourceRangeEnd) { /** local start in source range */
                        nextLocalRanges.push([localStart, sourceRangeEnd].map(n => n + offset));
                        localRanges[i][0] = sourceRangeEnd + 1;
                    } else if (localEnd >= sourceRangeStart && localEnd <= sourceRangeEnd) { /** local end in source range */
                        nextLocalRanges.push([sourceRangeStart, localEnd].map(n => n + offset));
                        localRanges[i][1] = sourceRangeStart - 1;
                    } else if (localStart <= sourceRangeStart && localEnd >= sourceRangeEnd) { /** local range exceeds both source boundaries */
                        nextLocalRanges.push([sourceRangeStart, sourceRangeEnd].map(n => n + offset));
                        localRanges[i] = [localStart, sourceRangeStart - 1];
                        localRanges.push([sourceRangeEnd + 1, localEnd]);
                    }
                })
            });
            nextLocalRanges.push(...localRanges.filter(x => x !== null));
            localRanges = nextLocalRanges;
        });
        return localRanges;
    });

    return [Math.min(...locations), Math.min(...locationRanges.map(range => range[0]))];

}