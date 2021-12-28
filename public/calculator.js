const currentBal = document.getElementById("current-bal-input");
const termYears = document.getElementById("term-years");
const termMonths = document.getElementById("term-months");
const interestRate = document.getElementById("current-rate");
const extraPayment = document.getElementById("extra-monthly");
const lumpSum = document.getElementById("lump-sum");

const currentPayment = document.getElementById("current-payment-span");
const newPayment = document.getElementById("new-payment-span");
const termReduction = document.getElementById("term-reduction-span");
const interestSaved = document.getElementById("interest-saved-span");

const calcButton = document.getElementById("calc-btn");
const saveButton = document.getElementById("save-btn");

const chartContainer = document.getElementById("mortgage-chart");

const viewSelector = document.getElementById("view-select");

const tableContainer = document.getElementById("table-container");

const currentScheduleColor = "rgb(94,86,86)";
const overpayScheduleColor = "rgb(88,102,139)";

let currentPaymentMonthly = 0;
let newMonthlyPayment = 0;
let newTermReduction = '';
let interestSaving = 0;
let scheduleToPlot;
let chartExist = false;

const currentMonthlyPayment = (rate, n, amount) => {
    //consider how the rate is input in the first place
    const rateVal = (Number(rate.value)/100)/12;
    const nVal = Number(n.value)*12;
    const amountVal = Number(amount.value);

    return (rateVal/(1-(1+rateVal)**(-1*nVal)))*amountVal;
}

const setValue = (element, value) => {
    element.innerHTML = value;
}

const roundDp = (num, dp) => {
    return +(Math.round(num + `e+${dp}`) + `e-${dp}`);
}

const decimalToYear = (yearDecimal) => {
    const yearDecimalStr = new String(yearDecimal);
    [years, months] = yearDecimalStr.split(".");
    return roundDp(Number(`${years}.${Number(months)*12}`), 1);
}

const parseTermReduction = (yearMonths) => {
    const yearMonthsStr = new String(yearMonths);
    [year, months] = yearMonthsStr.split(".");
    return `${year} yrs, ${months} mths`
}

const percentFormat = (num) => {
    return num+"%";
}

let sterlingFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP'
    })

const decimaliseMonths = (termYears, termMonths) => {
    const termMonthsRec = termMonths.value.trim() === '' ? Number(0) : Number(termMonths.value);
    const decMonths = Number(termMonthsRec)/60;
    return Number(termYears.value)+decMonths;

}

const newTerm = (interestRate, currentBal, termYears, termMonths, extraPayment, lumpSum=0) => {
    
    const decTerm = decimaliseMonths(termYears, termMonths);

    const ls = lumpSum.value.trim() === '' ? Number(0) : Number(lumpSum.value);
    const i = Number(currentBal.value);
    const l = Number(extraPayment.value);
    const h = Number(decTerm);
    const o = Number(interestRate.value);
    const c = Number(12);
    const p = 1*i;
    const g = 1*l;
    const v = 1*h;
    const M = 1*h;
    const x_old = 1*i;
    const x = 1*i-ls;

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
    const totalInterest = roundDp(mainPayment*(M*c)-x, 2);
    const totalInterestOver = roundDp(overPayment*termRevised-x, 2);

    if(ls === 0) {
        [m, u, x_axis] = balanceSchedule(x, v, c, p, f, B, L, I);
    } else {
        [m, u, x_axis] = balanceSchedule(x_old, v, c, p, f, B, L, I, ls);
    }

    return [roundDp(((h*12) - termRevised)/12, 2), totalInterest, totalInterestOver, m, u, x_axis, ls]; 
}


const balanceSchedule = (x, v, c, p, f, B, L, I, ls=0)=> {
    let P = 0; 
    let w = 0;
    let m = []; 
    let u = [];
    let x_axis = [];

    m.push(Number(x.toFixed(2)));
    u.push(Number((x-ls).toFixed(2)));

    for(let A=0; v*c>=A; A++) {
        let b = p*Math.pow(1+f, A);
        E=-B;
        H=-L;
        O = Math.pow(1+f, A)-1;
        Y = E*O/f;
        C = H*O/f;
        T = b+C-ls;
        I = b+Y;
        12==P&&(w++,P=0,0>=I?m.push(Number(0)):m.push(Number(Math.max(0,I).toFixed(2))),0>=T?u.push(Number(0)):u.push(Number(Math.max(0,T).toFixed(2))));
        P++
    }

    for(let num=1; num < m.length+1; num ++) {
        x_axis.push(num);
    }

    return [m, u.filter(x=> x!==0), x_axis];
}

const layout = {
    autosize: true,
    paper_bgcolor: 'rgba(0, 0 , 0, 0)',
    plot_bgcolor: 'rgba(0, 0 , 0, 0)',
    showlegend: true,
    title: {
        text: 'Balance Schedule',
        font: {
            color: "#FFFFFF",
            size: 18
        }
    },
    legend: {
        x: 0.5,

        y:1,
        font: {
            color: '#FFFFFF'
        }
    },
    yaxis: {
        color: '#FFFFFF',
        title: {
            text: 'Mortgage Balance (£)'
        }
    },
    xaxis: {
        title: {
            text: "Elapsed Time (years)"
        },
        color: '#FFFFFF',
        autogrange:true,
        tickfont: {
            size:10
        }
    }
}

const config = {
    responsive: true,
}

const createPlotlyTrace = (x, y, color, name, dash=false) => {
    if(dash) {
        return {
            x: x,
            y: y,
            mode: 'bar',
            name: name,
            line: {
                shape: 'spline',
                color: color,
                width: 1
            },
            type: 'scatter'
        }
    } else {
        return {
            x: x,
            y: y,
            mode: 'bar',
            name: name,
            line: {
                shape: 'spline',
                color: color,
                dash: "solid",
                width: 1
            },
            type: 'scatter'
        }
    }
    
}

const dataToSend = (balance, term, rate, extraPayment=0, lumpSum=0, monthlyPayment, newMonthlyPayment, termReduction, interestSaving) => {
    return {balance: balance,
            term: term,
            interestRate: rate,
            extraPayment: extraPayment,
            lumpSum: lumpSum,
            monthlyPayment: monthlyPayment,
            newMonthlyPayment: newMonthlyPayment,
            termReduction: termReduction,
            interestSaved: interestSaving
            }
}



calcButton.addEventListener("click", ()=> {
     const curMonthlyPayment = Number(currentMonthlyPayment(interestRate, termYears, currentBal));
     currentPaymentMonthly = curMonthlyPayment;
     const extraMonthlyVal = extraPayment.value;
     newMonthlyPayment = Number(extraMonthlyVal) + Number(curMonthlyPayment);
     setValue(currentPayment, `${sterlingFormatter.format(roundDp(curMonthlyPayment, 2))}`)
     setValue(newPayment, 
        `${sterlingFormatter.format(roundDp(Number(curMonthlyPayment) + Number(extraMonthlyVal), 2))}`);
     [newT, totalInterest, totalInterestOver, w_o_overpay, w_overpay, x_axis, lump] = newTerm(interestRate, currentBal, termYears, termMonths, extraPayment, lumpSum);
     newTermReduction = newT;
     const savedInterest = totalInterest - totalInterestOver - lump;
     interestSaving = savedInterest;
     setValue(termReduction, `${parseTermReduction(decimalToYear(newT))}`);
     setValue(interestSaved, `${sterlingFormatter.format(roundDp(savedInterest, 2))}`);
     const schedulePlot = [createPlotlyTrace(x_axis, w_o_overpay, currentScheduleColor, "without overpayment"), 
                            createPlotlyTrace(x_axis, w_overpay, overpayScheduleColor, "with overpayments", dash=true)];
     scheduleToPlot = schedulePlot;


    //const tblContainer = document.createElement("div");
    //chartContainer.appendChild(tblContainer);
    Plotly.newPlot(tableContainer, schedulePlot, layout, config);

   
     }   
    
)

saveButton.addEventListener('click', async ()=> {
    console.log("save button clicked!");
    const data = dataToSend(Number(currentBal.value), termYears.value, Number(interestRate.value), Number(extraPayment.value), Number(lumpSum.value), 
        currentPaymentMonthly, Number(newMonthlyPayment), String(newTermReduction), interestSaving);
    console.log(data);
    try {
        await axios.post("/api/v1/scenarios", data)
    } catch (error) {
        console.log(error);
    }
})


const toggleSceduleScenario = (scheduleToPlot) => {
    if(viewSelector.value === "schedule" && scheduleToPlot) {
        
    } else {
        chartContainer.innerHTML = "This is a test";
    }
}

const showScenarios = async() => {
    try {
        const res = await axios.get("/api/v1/scenarios");
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

//refactor - need to clear out elements so they don't keep stacking

let tblFlag = false;
let chartFlag = false;

viewSelector.addEventListener("change", async ()=> {
    console.log(viewSelector.value);
    if(viewSelector.value === "schedule" && scheduleToPlot) {
        console.log("schedule")
        if(tblFlag) {
            console.log("table found");
            const scenarioTable = document.getElementById("scenario-tbl");
            scenarioTable.remove();
            tblFlag = false;
        }
        Plotly.newPlot(chartContainer, scheduleToPlot, layout, config);
        chartFlag = true;

    } else if(viewSelector.value === "scenarios"){
        console.log("scenarios")
        if(chartFlag) {

            Plotly.purge(chartContainer);
            chartFlag = false;
        }
        //create table element and append making get request
        //get request works but need to destructure the promise object
        data = await showScenarios();
        let idx = 0;
        let tbl = `<table id="scenario-tbl">
                    <tr>
                        <th>id</th>
                        <th>Balance</th>
                        <th>Interest Rate</th>
                        <th>Term</th>
                        <th>Monthly Payment</th>
                        <th>New Payment</th>
                        <th>Lump Sum</th>
                        <th>Term Reduction</th>
                        <th>Interest Saved</th>
                        <th>Remove</th>
                    </tr>`;
        for(let i of data.scenarios) {
            tbl += `<tr id="row_${idx}"> 
                        <td id="id_${idx}">${i._id}</td>
                        <td>${sterlingFormatter.format(roundDp(i.balance, 2))}</td>
                        <td>${percentFormat(roundDp(i.interestRate, 2))}</td>
                        <td>${i.term}</td>
                        <td>${sterlingFormatter.format(roundDp(i.monthlyPayment, 2))}</td>
                        <td>${sterlingFormatter.format(roundDp(i.newMonthlyPayment, 2))}</td>
                        <td>${sterlingFormatter.format(roundDp(i.lumpSum, 2))}</td>
                        <td>${i.termReduction}</td>
                        <td>${sterlingFormatter.format(roundDp(i.interestSaved, 2))}</td>
                        <td><button class="delete-btn"><i id="delete-${idx}" class="fas fa-trash"></button></td>
                    </tr>
                    `
            idx+=1;
        }
        tbl += `</table>`;
        //const tblContainer = document.createElement("div");
        //chartContainer.append(tblContainer);
        tableContainer.innerHTML = tbl;
        tblFlag = true;
       
    }
})

// this works but only on reload, need table creation to be handled in a function
// add trash icon to delete

document.body.addEventListener("click", async (event)=> {
    if(event.target.id.includes("delete")) {
        const idNum = event.target.id.split("-")[1];
        const idToDelete = document.getElementById(`id_${idNum}`).innerHTML;
        console.log(idToDelete);
        try {
            await axios.delete(`/api/v1/scenarios/${idToDelete}`);
            showScenarios();
        } catch (error) {
            console.log(error);
        }
    }
})