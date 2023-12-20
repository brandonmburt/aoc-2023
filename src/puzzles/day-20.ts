/** https://adventofcode.com/2023/day/20 */

interface Module {
    id: string,
    type: string; // '%' (flipflop), or '&' (conjunction), or id (for broadcaster and untyped)
    isOn?: boolean;
    inputs?: [string, boolean][] // [id, pulse]; pulse is true if 'high', false if 'low'
    destinations: string[] // module ids
}

interface Pulse {
    source: string;
    isHigh: boolean; // true represents high pulse, false represents low pulse
    dest: string;
}

export function solvePuzzle20(input: string): [number, number] {

    const moduleMap: Map<string, Module> = new Map();

    input.split('\n').forEach(line => {
        let [ source, dest ] = line.split(' -> ');
        const id = ['%', '&'].includes(source[0]) ? source.substring(1) : source;
        const type = ['%', '&'].includes(source[0]) ? source[0] : source;
        let m: Module = {
            id, type,
            isOn: type === '%' ? false : null,
            inputs: type === '&' ? [] : null,
            destinations: dest.includes(',') ? dest.split(', ') : [dest]
        }
        moduleMap.set(id, m);
    });

    // Inialize input pulse history for conjunction modules and add untyped modules to the map
    moduleMap.forEach((v, k) => {
        v.destinations.forEach(d => {
            if (!moduleMap.has(d)) moduleMap.set(d, { id: d, type: 'untyped', destinations: [] });
            if (moduleMap.get(d).type === '&') moduleMap.get(d).inputs.push([k, false]);
        });
    });

    const getConjunctionOutput = (id: string): boolean => {
        return !(moduleMap.get(id).inputs.every(([_, isHigh]) => isHigh === true));
    }

    const processPulses = (pulses: Pulse[]): Pulse[] => {
        let next: Pulse[] = [];
        pulses.forEach(pulse => {
            const { source, isHigh, dest } = pulse;
            highCount += iterations <= times && isHigh ? 1 : 0;
            lowCount += iterations <= times && !isHigh ? 1 : 0;
            let m: Module = moduleMap.get(dest);
            if (m.type === '%' && !isHigh) {
                moduleMap.get(dest).isOn = !m.isOn;
                m.destinations.forEach(id => next.push({ source: dest, isHigh: m.isOn, dest: id }));
            } else if (m.type === '&') {
                const i: number = m.inputs.findIndex(([id, ]) => id === source);
                moduleMap.get(dest).inputs[i][1] = isHigh;
                const outgoingPulse: boolean = getConjunctionOutput(dest);
                m.destinations.forEach(id => next.push({ source: dest, isHigh: outgoingPulse, dest: id }));
            } else if (m.type === 'broadcaster') {
                m.destinations.forEach(id => next.push({ source: dest, isHigh, dest: id }));
            } else if (m.id === 'rx') {
                dep.forEach(([id, cycle], i) => {
                    if (cycle === null && getConjunctionOutput(id)) dep[i][1] = iterations;
                });
            }
        });
        return next;
    }

    /** P1 Variables */
    const times = 1000;
    let lowCount = 0, highCount = 0;

    /** P2 Variables */
    let iterations = 0, shouldBreak = false;
    // 'vf' is a conjunction module that points to rx; we need to find cycles for the modules that point to 'vf'
    const dep: [string, number][] = [...moduleMap.values()].filter(v => v.destinations.includes('vf')).map(m => [m.id, null]);

    while (iterations < times || !shouldBreak) {
        iterations++;
        let pulses: Pulse[] = [{ source: '', isHigh: false, dest: 'broadcaster' } as Pulse];
        while (pulses.length > 0) pulses = processPulses(pulses);
        if (dep.every(([_, cycle]) => cycle !== null)) shouldBreak = true;
    }

    // 680278040, 243548140870057
    return [lowCount * highCount, dep.reduce((acc, [_, cycle]) => acc *= cycle, 1)];

}