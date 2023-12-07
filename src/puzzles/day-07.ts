/** https://adventofcode.com/2023/day/7 */

export function solvePuzzle7(input: string): [number, number] {

    let arr = input.split('\n').map(x => x.split(' '));

    /** 1: High card, 2: One pair, 3: Two pair, 4: Three of a kind, 5: Full house, 6: Four of a kind, 7: Five of a kind */
    const getHand = (s: string, p2?: boolean) => {
        let mySet = new Set(s), myMap = new Map();
        s.split('').forEach(c => myMap.has(c) ? myMap.get(c).n++ : myMap.set(c, { n: 1 }) );
        const size = mySet.size, max = Math.max(...Array.from(myMap.values()).map(x => x.n)), jokers = myMap.get('J')?.n ?? 0;
        return size === 1 ? 7 :
               size === 2 ? jokers > 0 && p2 ? 7 : max === 4 ? 6 : 5 :
               size === 3 ? jokers >= 2 && p2 ? 6 : jokers === 1 && p2 ? max === 2 ? 5 : 6 : max === 3 ? 4 : 3 :
               size === 4 ? (jokers > 0 && p2) ? 4 : 2 :
               size === 5 ? (jokers > 0 && p2) ? 2 : 1 : 0;
    }

    const getVal = (c, p2 = false) => c==='T' ? 10 : c==='J' ? p2 ? 1 : 11 : c==='Q' ? 12 : c==='K' ? 13 : c==='A' ? 14 : +c;

    const getWinnings = (arr, p2: boolean = false) => {
        return [...arr].sort(([handA, ], [handB, ]) => {
            if (getHand(handA, p2) === getHand(handB, p2)) {
                for (let i=0; i<5; i++) {
                    if (handA[i] !== handB[i]) return getVal(handA[i], p2) > getVal(handB[i], p2) ? 1 : -1;
                }
            } else return getHand(handA, p2) > getHand(handB, p2) ? 1 : -1;
        }).reduce((acc, [, bid], i) => acc + (+bid * (i+1)), 0);
    }

    return [getWinnings(arr, false), getWinnings(arr, true)];

}