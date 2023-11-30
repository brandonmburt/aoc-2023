import * as fs from 'fs';

export class FileUtils {

    public static getInput(day: number): string {
        const dayStr: string = day <= 9 ? '0' + day.toString() : day.toString();
        const path: string = 'day-' + dayStr + '.txt';
        return fs.readFileSync("./src/input/" + path).toString();
    }

}