
// const API_KEY = "b731d53e1de091143a1442ff5c69f576";

// function renderWeatherinfo(data){
//     let newpara = document.createElement('p');
    
//     newpara.textContent =  `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newpara);
// ;}


// async function fetchWeatherdetails(){
//     try{
//         let city = "Goa";

//        
//         console.log("Weather data:->" , data); 

//         renderWeatherinfo(data);

//     }
//     catch(err){

//     }

// }; 

    
// }


const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");

const grantaccessContainer = document.querySelector(".grant-location-container");
const Searchform = document.querySelector("[data-searchform]");
const LoadingScreen = document.querySelector(".loading-container");
const UserInfoContainer = document.querySelector(".user-info-container");

let oldTab = usertab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromsessiomstorage();

function switchtab(newtab){
    if(newtab !== oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newtab;
        oldTab.classList.add("current-tab");

        if(!Searchform.classList.contains("active")){
            //kya search form wala container is invisible, if yes then make it visible.
            UserInfoContainer.classList.remove("active");
            grantaccessContainer.classList.remove("active");
            Searchform.classList.add("active");
        }
        else{
            //main phele wale serch tab pr tha ab your weather tab ko visible krna ha
            Searchform.classList.remove("active");
            UserInfoContainer.classList.remove("active");
            //ab main your weather tab ma aagya hu toh weather bhi display krna padega, 
            //so let's check local storage for cordinates if we have save them their.
            getfromsessiomstorage(); 
        }
    }
    

};

usertab.addEventListener('click',()=>{
    //Pass clicked tab as input parameter.
    switchtab(usertab);
});

searchtab.addEventListener('click',()=>{
    //Pass clicked tab as input parameter.
    switchtab(searchtab);
});

//check if cordinates are already present in session storage
function getfromsessiomstorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates"); 

    if(!localcoordinates){
        //localcoordinates nhi mile
       grantaccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
};

async function fetchuserweatherinfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant continer invivible
    grantaccessContainer.classList.remove("active");
    LoadingScreen.classList.add("active");

    //API_CALL
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            
            const data = await response.json();

            LoadingScreen.classList.remove("active");
            UserInfoContainer.classList.add("active");
            renderweatherinfo(data);
    }
    catch(err){
              LoadingScreen.classList.remove("active");
    }
};

function renderweatherinfo(weatherInfo){
    //firstly we have to fetch the element

    const cityname = document.querySelector("[ data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-Weatherdesc]");
    const weathericon = document.querySelector("[data-WeatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-Windspeed]");
    const humidity = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-Cloudiness]");


    //fetch value from weatherInfo object and put in UI element.
    cityname.innerText = weatherInfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.descripton;
    weathericon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
    
};

function Getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
    //show an alert for no geolocation
    alert("NO GeoLocation Found"); 
    }
};

function showPosition(position){
   
    const usercoordinates ={
        lat: position.coords.latitude,
       lon:position.coords.longitude,
    }
    sessionStorage.getItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchuserweatherinfo(usercoordinates);
};

const GrantAccessbutton = document.querySelector("[data-grantaccess]");
GrantAccessbutton.addEventListener('click',Getlocation);

let searchinput = document.querySelector("[data-searchinput]");
Searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname = searchinput.value;
    
    if(searchinput.value === "") 
       return;
    else
       fetchsearchweatherinfo(cityname);
});

async function fetchsearchweatherinfo(city){
    LoadingScreen.classList.add("active");
    UserInfoContainer.classList.remove("active");
    grantaccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            LoadingScreen.classList.remove("active");
            UserInfoContainer.classList.add("active");
            renderweatherinfo(data);

    }
    catch(err){

    }
  
};