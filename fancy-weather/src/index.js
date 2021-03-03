// navigator.language
const elementLanguageButton = document.getElementById('language-button');
const elementCurrentTime = document.getElementById('weather-time-value');
const elementCurrentDayShort = document.getElementById('weather__day-of-the-week');
const elementCurrentMonthDate = document.getElementById('weather__month-date');
const elementCurrentMonth = document.getElementById('weather__month');
const elementFirstDayAfter = document.getElementById('1-day-after__day-of-the-week');
const elementSecondDayAfter = document.getElementById('2-day-after__day-of-the-week');
const elementThirdDayAfter = document.getElementById('3-day-after__day-of-the-week');

const elementTownInput = document.getElementById('town-input');
const elementSearchButton = document.getElementById('search-button');

let currentLanguage = 'en';

let ipLatitude;
let ipLongitude;

let geocodingCity;
let geocodingCountry;
let geocodingLatitude;
let geocodingLongitude;

let timeOnLocation;
let weatherCurrentTemp;
let weatherCurrentDescription;
let weatherCurrentFeelsLike;
let weatherCurrentWindSpeed;
let weatherCurrentHumidity;
let weatherCurrentIcon;
let weatherFirstDayAfterTemp;
let weatherFirstDayAfterIcon;
let weatherSecondDayAfterTemp;
let weatherSecondDayAfterIcon;
let weatherThirdDayAfterTemp;
let weatherThirdDayAfterIcon;


const dictionary = {
    en: {
        daysList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShortList: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
    ru: {
        daysList: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        daysShortList: ['Вск', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthList: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
    }
}

function Initialization() {
    loadSaveLanguage();
    setDateAndTime();
}

function setDateAndTime() {
    let today = new Date();
    let day = today.getDay();
    let date = today.getDate();
    let month = today.getMonth();
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    elementCurrentTime.innerHTML = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
    elementCurrentMonthDate.innerHTML = date;
    elementCurrentDayShort.innerHTML = dictionary[currentLanguage].daysShortList[day];
    elementCurrentMonth.innerHTML = dictionary[currentLanguage].monthList[month];
    elementFirstDayAfter.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day+1)];
    elementSecondDayAfter.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day+2)];
    elementThirdDayAfter.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day+3)];
    setTimeout(setDateAndTime, 1000);
}

function addZero(n) {
    return n < 10 ? '0' + n : n;
}

function checkForExtraDays(n) {
    return n > 6 ? n - 7 : n;
}

function toggleCurrentLanguage() {
    currentLanguage = elementLanguageButton.value;
    localStorage.setItem('language', currentLanguage);
    setDateAndTime();
}

function loadSaveLanguage(){
    if (localStorage.getItem('language') === null) {
        localStorage.setItem('language', 'en');
    } else {
        currentLanguage = elementLanguageButton.value = localStorage.getItem('language');
    }
}

function getLocation(){
    fetch('https://ipinfo.io/json?token=72f4ef7fa30822')
        .then((response) => response.json())
        .then((jsonResponse) => {
            console.log(jsonResponse);
            ipLatitude = jsonResponse.loc.split(',')[0];
            ipLongitude = jsonResponse.loc.split(',')[1];
        })
}

function loadWeather(latitude, longitude){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&lang=${currentLanguage}&appid=43aa3c58f07da360c90f88e6c11cdac3`)
        .then((response) => response.json())
        .then((jsonResponse) => {
            console.log(jsonResponse);
            timeOnLocation = jsonResponse.current.dt * 1000;
            weatherCurrentTemp = jsonResponse.current.temp;
            weatherCurrentDescription = jsonResponse.current.weather[0].description;
            weatherCurrentFeelsLike = jsonResponse.current.feels_like;
            weatherCurrentWindSpeed = jsonResponse.current.wind_speed;
            weatherCurrentHumidity = jsonResponse.current.humidity;
            weatherCurrentIcon = jsonResponse.current.weather[0].icon;
            weatherFirstDayAfterTemp = jsonResponse.daily[1].temp.day;
            weatherFirstDayAfterIcon = jsonResponse.daily[1].weather[0].icon;
            weatherSecondDayAfterTemp = jsonResponse.daily[2].temp.day;
            weatherSecondDayAfterIcon = jsonResponse.daily[2].weather[0].icon;
            weatherThirdDayAfterTemp = jsonResponse.daily[3].temp.day;
            weatherThirdDayAfterIcon = jsonResponse.daily[3].weather[0].icon;
            console.log(weatherFirstDayAfterIcon, weatherSecondDayAfterIcon, weatherThirdDayAfterIcon);
        })
}

function getCoordinates(query){
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=7dd8ba7a84bd4d0fa897bf84577d8693&language=${currentLanguage}&no_annotations=1&limit=1`)
        .then((response) => response.json())
        .then((jsonResponse) => {
            console.log(jsonResponse);
            geocodingCity = jsonResponse.results[0].components.city;
            geocodingCountry = jsonResponse.results[0].components.country;
            geocodingLatitude = jsonResponse.results[0].geometry.lat;
            geocodingLongitude = jsonResponse.results[0].geometry.lng;
        })
}

function controlWeather() {
    let promise = new Promise ((resolve, reject) => {
        getCoordinates(elementTownInput.value);
        resolve();
    })
    promise.then(() => console.log(geocodingLatitude, geocodingLongitude))
        .then(() => loadWeather(geocodingLatitude, geocodingLongitude))
}


Initialization();

elementLanguageButton.addEventListener('change', toggleCurrentLanguage);

elementSearchButton.addEventListener('click', controlWeather)