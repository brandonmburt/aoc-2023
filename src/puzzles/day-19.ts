/** https://adventofcode.com/2023/day/19 */

interface Rule {
    variable?: string;
    op?: string;
    val?: number;
    dest?: string;
    hasOp: boolean;
}

interface Rating {
    x: number;
    m: number;
    a: number;
    s: number;
}

export function solvePuzzle19(input: string): [number, number] {

    let [wInput, rInput] = input.split('\n\n');

    const workflowsMap: Map<string, Rule[]> = new Map([
        ...wInput.split('\n').reduce((acc, w) => {
            let [ name, str ] = w.split('{');
            str = str.substring(0, str.length-1);
            const rules: Rule[] = str.split(',').map(r => {
                if (r.includes(':')) {
                    const [ rule, dest ] = r.split(':'), op: string = rule.includes('>') ? '>' : '<';
                    const [ variable, val ] = rule.split(op);
                    return { variable, op, val: +val, dest, hasOp: true } as Rule;
                } else return { dest: r, hasOp: false } as Rule;
            });
            acc.push([name, rules]);
            return acc;
        }, [])
    ]);

    const ratings: Rating[] = rInput.split('\n').map(s => {
        return s.substring(1, s.length-1).split(',').reduce((acc, item) => {
            const [key, val] = item.split('=');
            acc[key] = +val;
            return acc;
        }, {}) as Rating;
    });
    
    const p1: number = ratings.reduce((acc, ra) => {
        let name = 'in';
        while (name !== 'R' && name !== 'A') {
            for (let r of workflowsMap.get(name)) {
                if (r.hasOp === false || (r.op === '>' && ra[r.variable] > r.val) || (r.op === '<' && ra[r.variable] < r.val)) {
                    name = r.dest;
                    break;
                }
            }
        }
        return acc += name === 'A' ? ['x', 'm', 'a', 's'].reduce((a, v) => a += ra[v], 0) : 0;
    }, 0);

    let p2: number = 0, states: any[] = [{ name: 'in', x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }];
    while (states.length > 0) {
        let s = states.pop();
        if (s.name === 'A') p2 += ['x', 'm', 'a', 's'].reduce((acc, v) => acc *= (s[v][1] - s[v][0] + 1), 1);
        else if (s.name === 'R') continue;
        else {
            for (let r of workflowsMap.get(s.name)) {
                if (r.hasOp === false) {
                    states.push({ ...s, name: r.dest });
                    break;
                } else {
                    const [ min, max ] = s[r.variable];
                    if (r.op === '>') {
                        if (min > r.val) {
                            states.push({ ...s, name: r.dest });
                            break;
                        } else if (max > r.val) {
                            states.push(
                                { ...s, [r.variable]: [r.val+1, max], name: r.dest },
                                { ...s, [r.variable]: [min, r.val] },
                            );
                            break;
                        }
                    } else if (r.op === '<') {
                        if (max < r.val) {
                            states.push({ ...s, name: r.dest });
                            break;
                        } else if (min < r.val) {
                            states.push(
                                { ...s, [r.variable]: [r.val, max] },
                                { ...s, [r.variable]: [min, r.val-1], name: r.dest },
                            );
                            break;
                        }
                    }
                }
            }
        }
    }

    // 446935, 141882534122898
    return [p1, p2];

}