const sliderMin = document.getElementById("slider-min");
const sliderMax = document.getElementById("slider-max");

const rangeMin = document.getElementById("range-min");
const rangeMax = document.getElementById("range-max");

const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");

const myPostcode = document.getElementById("post-code");

const myCity = document.getElementById("city");

const myRegion = document.getElementById("region");

const mySelect = document.getElementById("my-select");

const trackSlider = document.getElementById("track-slider");

const searchBtn = document.getElementById("sea-btn");

const tableContainer = document.getElementById("table-container");

let maxSliderValue = document.getElementById("slider-max").max;
let minSliderValue = document.getElementById("slider-min").min;

let searchData = {};

const minGap = 0;

window.onload = ()=> {
    slideMin();
    slideMax();
};

const slideMin = () => {
    if(parseInt(sliderMax.value) - parseInt(sliderMin.value) <= minGap) {
        sliderMin.value = parseInt(sliderMax.value) - minGap;
 
    }
    rangeMin.innerHTML = sliderMin.value;
    fillColour();
}

const slideMax = () => {
    if(parseInt(sliderMax.value) - parseInt(sliderMin.value) <= minGap) {
        sliderMax.value = parseInt(sliderMin.value) + minGap;
    }
    rangeMax.innerHTML = sliderMax.value;
    fillColour();
}


const fillColour = () => {
    pc1 = ((parseInt(sliderMin.value)-minSliderValue)/(maxSliderValue-minSliderValue))*100;
    pc2 = ((parseInt(sliderMax.value)-minSliderValue)/(maxSliderValue-minSliderValue))*100;

    trackSlider.style.background = `linear-gradient(to right, #dadae5 ${pc1}% , #5e5656 ${pc1}% , #5e5656 ${pc2}%, #ebf4f6 ${pc2}%)`;
    
}


const queryObject = (rangeMin, rangeMax, priceMin, priceMax, mySelect, myPostcode, 
    outwardPostcode, myCity, myRegion) => {

    return {yearMin: rangeMin === undefined ? undefined: parseInt(rangeMin),
        yearMax: rangeMax === undefined ? undefined: parseInt(rangeMax),
        minPrice: priceMin === undefined ? undefined: parseInt(priceMin),
        maxPrice: priceMax === undefined ? undefined: parseInt(priceMax),
        property_type: mySelect,
        postcode: myPostcode,
        outward_postcode: outwardPostcode,
        city: myCity,
        region: myRegion}};


const generateQuery = (queryParams) => {
    let apiRoute = "/api/v1/prices_all?";
    let queryContainer = [];
    let numericFilterContainer = [];
        
    const {yearMin, yearMax, minPrice, maxPrice, 
            property_type, postcode, outward_postcode, city, region} = queryParams;
    
    if(yearMin || yearMax || minPrice || maxPrice) {
        if(yearMin) {
            if(numericFilterContainer.length) {
                numericFilterContainer.push(`year>${yearMin}`)
            } else {
                numericFilterContainer.push(`filterNumericValues=year>${yearMin}`)
            }
        }
    
        if(minPrice) {
            if(numericFilterContainer.length) {
                numericFilterContainer.push(`price>${minPrice}`)
            } else {
                numericFilterContainer.push(`filterNumericValues=price>${minPrice}`)
            }
        }
        apiRoute += numericFilterContainer.join(",")
    }
    
    if(outward_postcode) {
        queryContainer.push(`outward_postcode=${outward_postcode}`);
    }
    
    if(property_type) {
        queryContainer.push(`property_type=${property_type}`);
    }
    
    if(city) {
        queryContainer.push(`city=${city}`);
    }
    
    if(region) {
        queryContainer.push(`region=${region}`);
    }
    
    if(apiRoute.includes("Numeric")) {
        apiRoute += "&"+queryContainer.join("&");
    } else {
        apiRoute += queryContainer.join("&");
    }
    return apiRoute;
}

const testAPI = async(queryString) => {
    
    //"/api/v1/prices_all?filterNumericValues=price>100000,year>2020&outward_postcode=B30"
    try {
        //res = await axios.get("/api/v1/prices_all?outward_postcode=B30&property_type=terrace")
        //"/api/v1/prices_all?filterNumericValues=price>300000&outward_postcode=B30"
        res = await axios.get(queryString)
        
        return res.data;

    } catch(error) {
        console.log(error)
    }
}

const renderSearchTable = (data, tblContainer) => {
    let idx = 0;
    let tbl = `<table id="search-tbl">
        <tr>
            <th>Postcode</th>
            <th>Sale Date</th>
            <th>City</th>
            <th>Region</th>
            <th>Property Type</th>
            <th>Price <i class="fas fa-sort" id="price-sort-btn" ></i></th>
            </tr>`;
    for(let i of data) {
        tbl += `<tr id="row_${idx}"> 
                    <td>${i.postcode}</td>
                    <td>${i.date}</td>
                    <td>${i.city}</td>
                    <td>${i.region}</td>
                    <td>${i.property_type}</td>
                    <td>${i.price}</td>
                </tr>
                `
        idx+=1;
    }
    tbl += `</table>`;
    tblContainer.innerHTML = tbl;

}


searchBtn.addEventListener("click", async()=> {
    
    const myObj = queryObject(rangeMin.innerHTML, rangeMax.innerHTML, priceMin.value, priceMax.value, mySelect.value, 
                               myPostcode.value, myPostcode.value.trim().slice(0,3), myCity.value, myRegion.value)

    console.log(myObj);
    const qry = generateQuery(myObj);

    console.log(qry);

    data = await testAPI(qry);

    renderSearchTable(data.prices, tableContainer);


    //data = await testAPI();
    //console.log(data);
})

const sortPrices = (dataContainer, direction) => {
    if(direction === "desc") {
        dataContainer.sort((a,b) => b.price - a.price)
    } else {
        dataContainer.sort((a,b) => a.price - b.price)
    }
}

let sortCounter = -1;

document.body.addEventListener("click", (event)=> {
    if(event.target.id === "price-sort-btn") {
        console.log("sort button clicked!");
        sortCounter ++;
        if(sortCounter %2 === 0) {
            sortPrices(data.prices, "desc");
            renderSearchTable(data.prices, tableContainer);
        } else {
            sortPrices(data.prices, "asc");
            renderSearchTable(data.prices, tableContainer);
        }
    }
})
