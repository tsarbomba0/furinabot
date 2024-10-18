let expectedXp: number;
let overflow: number;

export function xpcalc(xp: number, level: number){
    // xp = formula = (current level+1)^2 + 100
    expectedXp = (level+1)^2 + 100
    if(xp>=expectedXp){
        overflow = xp - expectedXp
        return level+1
    } else {
        return level
    }
}