/** https://adventofcode.com/2023/day/25 */

export function solvePuzzle25(input: string): [number, number] {

    const graph: Record<string, string[]> = {};
    const addNode = (n: string) => {
        if (!graph[n]) graph[n] = [];
    }
    const addEdge = (n1: string, n2: string) => {
        addNode(n1);
        addNode(n2);
        graph[n1].push(n2);
        graph[n2].push(n1);
    }

    input.split('\n').forEach(line => {
        let [l, r] = line.split(': ');
        let rArr = r.split(' ');
        rArr.forEach(r => addEdge(l, r));
    });

    const KEYS = Object.keys(graph);
    const getRandKey = () => KEYS[Math.floor(Math.abs(Math.random() * KEYS.length-1))]; 

    const findPath = (start: string, end: string): string[] | null => {
        const visited: Record<string, boolean> = {};
        const queue: { node: string; path: string[] }[] = [{ node: start, path: [] }];
        visited[start] = true;

        while (queue.length > 0) {
            const { node, path } = queue.shift()!;
            if (node === end) return path; // Found a path
            for (const neighbor of graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push({ node: neighbor, path: path.concat(neighbor) });
                }
            }
        }

        return null; // No path found
    }

    // Find the three most commonly traversed edges by repeatedly finding a path between two random nodes
    const edgeOccurences = new Map<string, number>();
    for (let i=0; i<100; i++) {
        const start = getRandKey(), end = getRandKey();
        if (start === end) continue;
        const path: string[] = findPath(start, end);
        const edges: string[] = [];
        for (let i=1; i<path.length; i++) {
            const edge = [path[i], path[i-1]].sort((a,b) => a.localeCompare(b)).join('-');
            edges.push(edge);
        }
        edges.forEach(edge => {
            if (!edgeOccurences.has(edge)) edgeOccurences.set(edge, 1);
            else edgeOccurences.set(edge, edgeOccurences.get(edge)+1);
        });
    }

    let occurences = [];
    edgeOccurences.forEach((value, key) => occurences.push([key, value]));
    const toCut: string[] = occurences.sort((a,b) => b[1] - a[1]).splice(0, 3).map(o => o[0]);

    // Cut the three most commonly traversed edges
    toCut.forEach(edge => {
        const [n1, n2] = edge.split('-');
        graph[n1] = graph[n1].filter(n => n !== n2);
        graph[n2] = graph[n2].filter(n => n !== n1);
    });

    // Find the size of a remaining subgraph, and multiply by the dervied size of the other
    const visited: Record<string, boolean> = {};
    const queue: string[] = [KEYS[0]];
    visited[KEYS[0]] = true;
    let size = 0;
    while (queue.length > 0) {
        const node = queue.shift()!;
        size++;
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.push(neighbor);
            }
        }
    }
    const p1 = size * (KEYS.length - size);

    // 602151
    return [p1, 50];
}