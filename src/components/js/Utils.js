function randomInt(min,max){
    if(min>max){
        throw Error("min MUST smaller than max")
    }
    let a=Math.random();
    return Math.floor(a*(max+1-min)+min);
}

export {randomInt};