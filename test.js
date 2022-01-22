
// // // // const roundTwoDp = (num) => {
// // // //     return +(Math.round(num + "e+2") + "e-2");
// // // // }

// // // // const roundOneDp = (num) => {
// // // //     return +(Math.round(num + "e+1") + "e-1");
// // // // }

// // // // const newTerm = (interestRate, currentBal, termYears, extraPayment, lumpSum=0) => {
// // // //     const i = Number(currentBal);
// // // //     const l = Number(extraPayment);
// // // //     const h = Number(termYears);
// // // //     const o = Number(interestRate);
// // // //     const c = Number(12);
// // // //     const p = 1*i;
// // // //     const g = 1*l;
// // // //     const v = 1*h;
// // // //     const M = 1*h;
// // // //     const x = 1*i-lumpSum;

// // // //     const f = o/1200;
// // // //     const I = p;
// // // //     const T = p;
// // // //     const F = p*f;
// // // //     const R = 1 - Math.pow(1+f, -(v*c));
// // // //     const B = F/R;
// // // //     const L = F/R+g;
    
// // // //     const mainPayment = B;
// // // //     const overPayment = L;

// // // //     const termRevised = Math.log(1/(1-x*f/overPayment))/Math.log(1+f);
// // // //     const totalInterest = roundTwoDp(mainPayment*(M*c)-x);
// // // //     const totalInterestOver = roundTwoDp(overPayment*termRevised-x);

// // // //     // [m, u, x_axis] = balanceSchedule(x, v, c, p, f, B, L, I);

// // // //     //return [roundTwoDp(((h*12) - termRevised)/12), totalInterest, totalInterestOver, m, u, x_axis]; 
// // // //     return [roundTwoDp(((h*12) - termRevised)/12), totalInterest, totalInterestOver, totalInterest-totalInterestOver-lumpSum]; 
// // // // }

// // // // console.log(newTerm(2.2, 100000, 25, 500, lumpSum=20000));

// // // // const decimalToYear = (yearDecimal) => {
// // // //     const yearDecimalStr = new String(yearDecimal);
// // // //     [years, months] = yearDecimalStr.split(".");
// // // //     return roundOneDp(Number(`${years}.${Number(months)*12}`));
// // // // }

// // // // const parseTermReduction = (yearMonths) => {
// // // //     const yearMonths = new String(yearMonths);
// // // //     [year, months] = yearMonths.split(".");
// // // //     return `${year} yrs, ${months} mths`
// // // // }

// // // // console.log(decimalToYear(9.46));

// // // const myArray = [1, 2, 3, 4, 5];

// // // let squares = [];

// // // myArray.forEach((item)=> squares.push(item**2));

// // // console.log(squares);

// // console.log("b30".toUpperCase());

// //res = await axios.get("/api/v1/prices_all?outward_postcode=B30&property_type=terrace")
// //"/api/v1/prices_all?filterNumericValues=price>300000&outward_postcode=B30"



// const rangeMin = "2009";
// const rangeMax = "2021";
// const priceMin = "100000";
// const priceMax = "500000"
// const mySelect = "terrace"
// const myPostcode = undefined
// const outwardPostcode = "B30" 
// const myCity = "BIRMINGHAM" 
// const myRegion = "WEST MIDLANDS"

// const queryObject = (rangeMin, rangeMax, priceMin, priceMax, mySelect, myPostcode, 
//                     outwardPostcode, myCity, myRegion) => {
//     console.log(rangeMin);

//     return {yearMin: rangeMin === undefined ? undefined: parseInt(rangeMin),
//         yearMax: rangeMax === undefined ? undefined: parseInt(rangeMax),
//         minPrice: priceMin === undefined ? undefined: parseInt(priceMin),
//         maxPrice: priceMax === undefined ? undefined: parseInt(priceMax),
//         property_type: mySelect,
//         postcode: myPostcode,
//         outward_postcode: outwardPostcode,
//         city: myCity,
//         region: myRegion}};

// const myObj = queryObject(rangeMin, rangeMax, priceMin, priceMax, mySelect, 
//                             myPostcode, outwardPostcode, myCity, myRegion)

// // const removeObjUndefined = (obj) => {
// //     Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
// // }

// //removeObjUndefined(myObj);

// console.log(myObj);

// const generateQuery = (queryParams) => {
//     let apiRoute = "/api/v1/prices_all?";
//     let queryContainer = [];
//     let numericFilterContainer = [];
    
//     const {yearMin, yearMax, minPrice, maxPrice, 
//         property_type, postcode, outward_postcode, city, region} = queryParams;

//     console.log(queryParams);
    
//     //populate array and join

//     if(yearMin || yearMax || minPrice || maxPrice) {
//         if(yearMin) {
//             if(numericFilterContainer.length) {
//                 numericFilterContainer.push(`year>${yearMin}`)
//             } else {
//                 numericFilterContainer.push(`filterNumericValues=year>${yearMin}`)
//             }
//         }

//         if(minPrice) {
//             if(numericFilterContainer.length) {
//                 numericFilterContainer.push(`price>${minPrice}`)
//             } else {
//                 numericFilterContainer.push(`filterNumericValues=price>${minPrice}`)
//             }
//         }
//         apiRoute += numericFilterContainer.join(",")
//     }

//     if(outward_postcode) {
//         queryContainer.push(`outward_postcode=${outward_postcode}`);
//     }

//     if(property_type) {
//         queryContainer.push(`property_type=${property_type}`);
//     }

//     if(city) {
//         queryContainer.push(`city=${city}`);
//     }

//     if(region) {
//         queryContainer.push(`region=${region}`);
//     }

//     if(apiRoute.includes("Numeric")) {
//         apiRoute += "&"+queryContainer.join("&");
//     } else {
//         apiRoute += queryContainer.join("&");
//     }
//     console.log(apiRoute);
// }

// generateQuery(myObj);

// // let rm = "200";

// // console.log(!rm === undefined)
// // console.log(rm === undefined ? undefined: parseInt(rm));

const pc = "B30 1EZ";
const pc2 = "B30";

const getPostCode = (postcode) => {
    if(postcode.trim().length) {

    }
}

const s = "string"
console.log(s.slice(0, 3));
console.log(s);