
const roundTwoDp = (num) => {
    return +(Math.round(num + "e+2") + "e-2");
}

const roundOneDp = (num) => {
    return +(Math.round(num + "e+1") + "e-1");
}

const newTerm = (interestRate, currentBal, termYears, extraPayment, lumpSum=0) => {
    const i = Number(currentBal);
    const l = Number(extraPayment);
    const h = Number(termYears);
    const o = Number(interestRate);
    const c = Number(12);
    const p = 1*i;
    const g = 1*l;
    const v = 1*h;
    const M = 1*h;
    const x = 1*i-lumpSum;

    const f = o/1200;
    const I = p;
    const T = p;
    const F = p*f;
    const R = 1 - Math.pow(1+f, -(v*c));
    const B = F/R;
    const L = F/R+g;
    
    const mainPayment = B;
    const overPayment = L;

    const termRevised = Math.log(1/(1-x*f/overPayment))/Math.log(1+f);
    const totalInterest = roundTwoDp(mainPayment*(M*c)-x);
    const totalInterestOver = roundTwoDp(overPayment*termRevised-x);

    // [m, u, x_axis] = balanceSchedule(x, v, c, p, f, B, L, I);

    //return [roundTwoDp(((h*12) - termRevised)/12), totalInterest, totalInterestOver, m, u, x_axis]; 
    return [roundTwoDp(((h*12) - termRevised)/12), totalInterest, totalInterestOver, totalInterest-totalInterestOver-lumpSum]; 
}

console.log(newTerm(2.2, 100000, 25, 500, lumpSum=20000));

const decimalToYear = (yearDecimal) => {
    const yearDecimalStr = new String(yearDecimal);
    [years, months] = yearDecimalStr.split(".");
    return roundOneDp(Number(`${years}.${Number(months)*12}`));
}

const parseTermReduction = (yearMonths) => {
    const yearMonths = new String(yearMonths);
    [year, months] = yearMonths.split(".");
    return `${year} yrs, ${months} mths`
}

console.log(decimalToYear(9.46));