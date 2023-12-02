import * as Puzzles from '../puzzles';
import { FileUtils, DisplayUtils } from '../utils';
import { performance } from 'perf_hooks';

export class Wrapper {

    public static solve(day: number): void {
        if (day < 1 || day > 26) {
            console.log('Please enter valid number');
        } else {
            const input: string = FileUtils.getInput(day)
            const t1: number = performance.now();
            const [p1, p2] = this.executePuzzle(day, input);
            DisplayUtils.print(day, p1, p2, performance.now()-t1);
        }
        return;
    }

    private static executePuzzle(day: number, input: string): [any, any] {
        switch (day) {
            case 1:
                return Puzzles.solvePuzzle1(input);
            case 2:
                return Puzzles.solvePuzzle2(input);
            // case 3:
            //     return Puzzles.solvePuzzle3(input);
            // case 4:
            //     return Puzzles.solvePuzzle4(input);
            // case 5:
            //     return Puzzles.solvePuzzle5(input);
            // case 6:
            //     return Puzzles.solvePuzzle6(input);
            // case 7:
            //     return Puzzles.solvePuzzle7(input);
            // case 8:
            //     return Puzzles.solvePuzzle8(input);
            // case 9:
            //     return Puzzles.solvePuzzle9(input);
            // case 10:
            //     return Puzzles.solvePuzzle10(input);
            // case 11:
            //     return Puzzles.solvePuzzle11(input);
            // case 12:
            //     return Puzzles.solvePuzzle12(input);
            // case 13:
            //     return Puzzles.solvePuzzle13(input);
            // case 14:
            //     return Puzzles.solvePuzzle14(input);
            // case 15:
            //     return Puzzles.solvePuzzle15(input);
            // case 16:
            //     return Puzzles.solvePuzzle16(input);
            // case 17:
            //     return Puzzles.solvePuzzle17(input);
            // case 18:
            //     return Puzzles.solvePuzzle18(input);
            // case 19:
            //     return Puzzles.solvePuzzle19(input);
            // case 20:
            //     return Puzzles.solvePuzzle20(input);
            // case 21:
            //     return Puzzles.solvePuzzle21(input);
            // case 22:
            //     return Puzzles.solvePuzzle22(input);
            // case 23:
            //     return Puzzles.solvePuzzle23(input);
            // case 24:
            //     return Puzzles.solvePuzzle24(input);
            // case 25:
            //     return Puzzles.solvePuzzle25(input);
            default:
                return [0,0];
        }
    }

}
