import { calculatedLevel } from '../interfaces/calculatedLevel'
let expectedXp: number;


export function xpcalc(xp: number, level: number): calculatedLevel {
    // xp = formula = ((current level+1)^2 + 100)*10
    expectedXp = ((level+1)**2 + 100)*10
    let calc: calculatedLevel = {
        level: xp >= expectedXp ? level+1 : level,
        xp: xp >= expectedXp ? xp - expectedXp : xp
    }
    return calc
}