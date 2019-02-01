let proxy = 'https://cors-anywhere.herokuapp.com/';
let domStrings = {
    saveBtn:document.querySelector('.save'),
    input:document.querySelector('#city'),
    maxTemp:document.querySelector('.MaxVal'),
    minTemp:document.querySelector('.MinVal'),
    humidity:document.querySelector('.hVal'),
    windSpeed:document.querySelector('.wsVal'),
    location:document.querySelector('.location'),
    weatherState:document.querySelector('.weather'),
    temperature:document.querySelector('.temperature'),
    stateImg:document.querySelector('.w_img'),
}

async function getWoeid(location='Delhi') {
    let response = await fetch(`${proxy}https://www.metaweather.com/api/location/search/?query=${location}`);
    let res = await response.json();
    return res[0].woeid;  
}

async function getWeatherData(woeid=28743736) {
    let response = await fetch(`${proxy}https://www.metaweather.com/api/location/${woeid}/`);
    let res = await response.json();
    return {
        weather_resp:res.consolidated_weather[0],
        country:res.parent.title,
        city:res.title};  
}

async function saveTolocalStorage(){
    let location = domStrings.input.value;
    let woeid = await getWoeid(location);
    localStorage.setItem('Woeid',woeid);
}

function getFromLocalStorage() {
    return localStorage.getItem('Woeid')
}

async function Controller(e) {
    if(e!==undefined)await saveTolocalStorage();
    if(getFromLocalStorage()!==null && getFromLocalStorage().length>0){
        let weatherData= await getWeatherData(getFromLocalStorage());
        UIController(weatherData);
        
    }   
}

function UIController(data) {
    domStrings.maxTemp.textContent=`${Math.round(data.weather_resp.max_temp)} ℃`
    domStrings.stateImg.setAttribute('src',`https://www.metaweather.com/static/img/weather/png/${data.weather_resp.weather_state_abbr}.png`)
    domStrings.minTemp.textContent=`${Math.round(data.weather_resp.min_temp)} ℃`
    domStrings.windSpeed.textContent=`${Math.round(data.weather_resp.wind_speed)} mph`
    domStrings.humidity.textContent=`${Math.round(data.weather_resp.humidity)} %`
    domStrings.location.textContent=`${data.city} , ${data.country}`
    domStrings.weatherState.textContent=`${data.weather_resp.weather_state_name}`
    domStrings.temperature.textContent=`${Math.round(data.weather_resp.the_temp)} ℃`

    
    
}


domStrings.saveBtn.addEventListener('click',Controller);
Controller()
