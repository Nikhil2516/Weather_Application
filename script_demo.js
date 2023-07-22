const API_key = "d30359c28546924697d527c5349ad409";
//const API_key = "d1845658f92b31c64bd94f06f7188c9c";



async function fetchWeatherDetails(){
    try{
        const city = "brazil";

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();

        console.log("Weather -> "+ data);

        // const newPara = document.createElement('p');
        // newPara.textContent = `${data?.main?.temp.toFixed(2)}`;

        // document.body.appendChild(newPara);
        renderWeatherInfo(data);
    
    }
    catch(e)
    {
        console.log("Exception -> "+e);
    }
}


async function customWeatherDetails()
{
    try{

        const lat = "18.457603";
        const lon = "73.847510";

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();

        console.log("Weather2 -> "+data);
        renderWeatherInfo(data);

    }
    catch(err)
    {
        console.log("Exception2 = "+err);
    }
}

function renderWeatherInfo(data)
{
    const newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)}`;

    document.body.appendChild(newPara);
}