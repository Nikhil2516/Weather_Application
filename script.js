const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container") 

const grantLocation = document.querySelector(".grant-weather-location");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingContainer = document.querySelector(".loadingContainer");
const userInfoContainer = document.querySelector(".user-info-container");
const errorFound = document.querySelector(".error-container");
//set variable for current tab intially current tab is user tab
let oldTab = userTab;
//store API key
const API_key = "d30359c28546924697d527c5349ad409";
//add current-tab class to our selected tab to add background-colour
oldTab.classList.add("current-tab");

getFromStorageSession();


function switchTab(clickedTab)
{
    if(clickedTab!=oldTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab = clickedTab;
        oldTab.classList.add("current-tab");


        //check if search form wala container visible if no then make it visible
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantLocation.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //now search form container is visible then makle it invisible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //check cordinates to display weather in local storage
            getFromStorageSession();
        }
    }
}


userTab.addEventListener("click",() =>{

    //first make error found message invisible if visible
    errorFound.classList.remove("active");
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    //first make error found message invisible if visible
    errorFound.classList.remove("active");
    switchTab(searchTab);
});



//to check if coordinates already present in session storage
function getFromStorageSession()
{
    const localCoordinate = sessionStorage.getItem("user-coordinates");
    //if local cordinate is not present in session storage then grant access location make visible
    if(!localCoordinate)
    {
        //agar local cordinates nahi mile
        grantLocation.classList.add("active");   
    }
    else{
        //if we get local-coordinate then convert it to json format and pass to func to get weather info
        const coordinates = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    //first make error found message invisible if visible
    errorFound.classList.remove("active");
    
    const {latitude,longitude} = coordinates;
    //make grant location container invisible
    grantLocation.classList.remove("active");
    //make loader visible
    loadingContainer.classList.add("active");

    //fetch api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`);

        if(response.status === 404)
        {
            throw new Error("Location Not Found");
        }

        const data = await response.json();
        
        loadingContainer.classList.remove("active");
        renderWeatherInfo(data);
        userInfoContainer.classList.add("active");
        
    }
    catch(err)
    {
        loadingContainer.classList.remove("active");
        const message = document.querySelector("[error-message]");
        message.innerText = err;
        errorFound.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo)
{
    //get dynamic elemnets into attribute to set according to location
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryCode]");
    const weatherDesc = document.querySelector("[data-WeatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humadity]");
    const cloudness = document.querySelector("[data-cloud]");


    //fetch the values from weatherInfo object and show on UI element
    cityName.innerText =  weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C` ;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudness.innerText = `${weatherInfo?.clouds?.all} %`;
}

//if we click on grant access button to get our location then it will call getlocation function
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

function getlocation()
{
    try{
        //get your current location coordinates
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    catch(err){
        console.log("Error to get Location err = "+err);
    }
}

function showPosition(position)
{
    const userCoordinates = {
        latitude : position.coords.latitude,
        longitude : position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


// in search weather tab if we enter city name and click on button then
const searchInput = document.querySelector("[data-cityInput]");

searchForm.addEventListener("submit", (e) => {
    errorFound.classList.remove("active");
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    // Make loader visible and other user tab containers invisible
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantLocation.classList.remove("active");
  
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

      if(response.status === 404)
      {
            throw new Error("Invalid Location");
      }
      const data = await response.json();
      loadingContainer.classList.remove("active");
      // Check if the required data is available
      if (data && data.main && data.weather && data.weather.length > 0) {
        renderWeatherInfo(data);
        userInfoContainer.classList.add("active");
      } else {
        // Handle case when required data is missing or undefined
        const message = document.querySelector("[error-message]");
        message.innerText = "Weather data not found.";
        errorFound.classList.add("active");
      }
    } catch (err) {
      // Handle other API call errors
      loadingContainer.classList.remove("active");
      const message = document.querySelector("[error-message]");
      message.innerText = err;
        errorFound.classList.add("active");
        // console.log("error found");
    }
  }
  












