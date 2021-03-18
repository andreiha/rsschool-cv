import './style.css';
import './js/iconsImport';

const elementRefreshButton = document.getElementById('refresh-button');
const elementRefreshButtonArrows = document.getElementById('refresh-button__arrows');
const elementLanguageButton = document.getElementById('language-button');
const elementFahrenheitButton = document.getElementById('fahrenheit-button');
const elementCelsiumButton = document.getElementById('celsium-button');
const elementsTemperatureButtons = document.querySelectorAll('.temperature-buttons');
const elementTownInput = document.getElementById('town-input');
const elementSearchButton = document.getElementById('search-button');

const elementCurrentTime = document.getElementById('weather-time');
const elementCurrentDate = document.getElementById('weather-date');
const elementWeatherLocation = document.getElementById('weather-location');
const elementCurrentTemp = document.getElementById('temperature__now');
const elementCurrentIcon = document.getElementById('icon__now-img');
const elementWeatherDescription = document.getElementById('weather__summary');
const elementWeatherFeelsLike = document.getElementById('weather__apparent-temperature');
const elementWeatherWind = document.getElementById('weather__wind');
const elementWeatherHumidity = document.getElementById('weather__humidity');

const elementNext1DayName = document.getElementById('next-1-day__day-of-the-week');
const elementNext2DayName = document.getElementById('next-2-day__day-of-the-week');
const elementNext3DayName = document.getElementById('next-3-day__day-of-the-week');
const elementNext1DayTemp = document.getElementById('next-1-day__temperature');
const elementNext2DayTemp = document.getElementById('next-2-day__temperature');
const elementNext3DayTemp = document.getElementById('next-3-day__temperature');
const elementNext1DayIcon = document.getElementById('next-1-day__weather-icon-img');
const elementNext2DayIcon = document.getElementById('next-2-day__weather-icon-img');
const elementNext3DayIcon = document.getElementById('next-3-day__weather-icon-img');

const elementMap = document.getElementById('geolocation__map');
const elementMapContainer = document.getElementById('geolocation');
const elementLatitude = document.getElementById('geolocation-coordinate__latitude');
const elementLongitude = document.getElementById('geolocation-coordinate__longitude');
const elementBody = document.querySelector('body');

const elementMistakesTint = document.getElementById('mistakes-overlay-tint');
const elementMistakesText = document.getElementById('mistakes-window__text');
const elementMistakesButton = document.getElementById('mistakes-window__button');

let currentLanguage = 'en';
let currentScale = 'celsium';
let timeOfDay = '';
let timeOfTheYear = '';
let coordinatesIP;
const verticalScreenWidth = 1000;

const data = {
  geocoding: {},
  weather: {},
  time: {},
};

const dictionary = {
  en: {
    daysList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShortList: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    feelsLike: 'Feels like',
    wind: 'Wind',
    windSpeed: 'm/s',
    humidity: 'Humidity',
    latitude: 'Latitude',
    longitude: 'Longitude',
    mistake: 'Oooops, we have the mistakes. Try to enter the correct name of the place.',
    buttons: {
      search: 'SEARCH',
      placeholder: ' Search city',
    },
  },
  ru: {
    daysList: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    daysShortList: ['Вск', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthList: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
    feelsLike: 'Ощущается',
    wind: 'Ветер',
    windSpeed: 'м/c',
    humidity: 'Влажность',
    latitude: 'Широта',
    longitude: 'Долгота',
    mistake: 'Ууупс, произошла ошибка. Попробуйте ввести корректное наименование населенного пункта.',
    buttons: {
      search: 'ПОИСК',
      placeholder: ' Введите город',
    },
  },
};

function addZero(n) {
  return n < 10 ? `0${n}` : n;
}

function checkForExtraDays(n) {
  return n > 6 ? n - 7 : n;
}

function setDateAndTime() {
  const today = new Date();
  today.setHours(today.getUTCHours() + data.time.offset);
  const day = today.getDay();
  const date = today.getDate();
  const month = today.getMonth();
  const hour = today.getHours();
  data.time.month = month;
  data.time.hour = hour;
  const min = today.getMinutes();
  const sec = today.getSeconds();
  elementCurrentTime.innerHTML = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
  elementCurrentDate.innerHTML = `${dictionary[currentLanguage].daysShortList[day]} ${date} ${dictionary[currentLanguage].monthList[month]}`;
  elementNext1DayName.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day + 1)];
  elementNext2DayName.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day + 2)];
  elementNext3DayName.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day + 3)];
  setTimeout(setDateAndTime, 1000);
}

function toggleButtonLanguage() {
  elementTownInput.placeholder = `${dictionary[currentLanguage].buttons.placeholder}`;
  elementSearchButton.value = `${dictionary[currentLanguage].buttons.search}`;
}

function toggleCurrentLanguage() {
  currentLanguage = elementLanguageButton.value;
  localStorage.setItem('language', currentLanguage);
  toggleButtonLanguage();
  if (data.geocoding.city) {
    controlWeather();
  }
}

function loadSaveLanguage() {
  if (localStorage.getItem('language') === null) {
    localStorage.setItem('language', 'en');
  } else {
    currentLanguage = localStorage.getItem('language');
    elementLanguageButton.value = localStorage.getItem('language');
  }
  toggleButtonLanguage();
}

function convertCelsiumFahrenheit(value) {
  let result;
  if (data.weather.scale === 'celsium') {
    result = value * 1.8 + 32;
  }
  if (data.weather.scale === 'fahrenheit') {
    result = (value - 32) / 1.8;
  }
  return result;
}

function setCurrentWeatherScale() {
  if (currentScale !== data.weather.scale) {
    data.weather.currentTemp = convertCelsiumFahrenheit(data.weather.currentTemp);
    data.weather.currentFeelsLike = convertCelsiumFahrenheit(data.weather.currentFeelsLike);
    data.weather.nextFirstDayTemp = convertCelsiumFahrenheit(data.weather.nextFirstDayTemp);
    data.weather.nextSecondDayTemp = convertCelsiumFahrenheit(data.weather.nextSecondDayTemp);
    data.weather.nextThirdDayTemp = convertCelsiumFahrenheit(data.weather.nextThirdDayTemp);
    if (data.weather.scale === 'celsium') {
      data.weather.scale = 'fahrenheit';
    } else {
      data.weather.scale = 'celsium';
    }
    if (elementWeatherLocation.innerHTML !== '') {
      fillDOMContent();
    }
  }
}

function toggleTemperatureButton() {
  if (currentScale === 'fahrenheit') {
    elementFahrenheitButton.classList.remove('transparent');
    elementCelsiumButton.classList.add('transparent');
  }
  if (currentScale === 'celsium') {
    elementCelsiumButton.classList.remove('transparent');
    elementFahrenheitButton.classList.add('transparent');
  }
  localStorage.setItem('scale', currentScale);
  setCurrentWeatherScale();
}

function loadSaveScale() {
  if (localStorage.getItem('scale') === null) {
    localStorage.setItem('scale', 'celsium');
  } else {
    currentScale = localStorage.getItem('scale');
  }
  toggleTemperatureButton();
}

function getLocationByIP() {
  return fetch('https://ipinfo.io/json?token=72f4ef7fa30822')
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse);
      coordinatesIP = jsonResponse.loc;
      return data;
    });
}

function getCoordinates(query) {
  return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=7dd8ba7a84bd4d0fa897bf84577d8693&language=${currentLanguage}&no_annotations=1&limit=1`)
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse);
      data.geocoding.city = jsonResponse.results[0].components.city || jsonResponse.results[0].components.town || jsonResponse.results[0].components.village;
      data.geocoding.country = jsonResponse.results[0].components.country;
      data.geocoding.latitude = jsonResponse.results[0].geometry.lat;
      data.geocoding.longitude = jsonResponse.results[0].geometry.lng;
      return data;
    });
}

function loadWeather(data) {
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.geocoding.latitude}&lon=${data.geocoding.longitude}&exclude=minutely,hourly,alerts&units=metric&lang=${currentLanguage}&appid=43aa3c58f07da360c90f88e6c11cdac3`)
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse);
      data.time.offset = jsonResponse.timezone_offset / 3600;
      data.weather.currentTemp = jsonResponse.current.temp;
      data.weather.scale = 'celsium';
      data.weather.currentDescription = jsonResponse.current.weather[0].description;
      data.weather.currentFeelsLike = jsonResponse.current.feels_like;
      data.weather.currentWindSpeed = jsonResponse.current.wind_speed;
      data.weather.currentHumidity = jsonResponse.current.humidity;
      data.weather.currentIcon = jsonResponse.current.weather[0].icon;
      data.weather.nextFirstDayTemp = jsonResponse.daily[1].temp.day;
      data.weather.nextFirstDayIcon = jsonResponse.daily[1].weather[0].icon;
      data.weather.nextSecondDayTemp = jsonResponse.daily[2].temp.day;
      data.weather.nextSecondDayIcon = jsonResponse.daily[2].weather[0].icon;
      data.weather.nextThirdDayTemp = jsonResponse.daily[3].temp.day;
      data.weather.nextThirdDayIcon = jsonResponse.daily[3].weather[0].icon;
      return data;
    });
}

function determineTimeOfDay() {
  switch (true) {
    case data.time.hour >= 5 && data.time.hour <= 11:
      timeOfDay = 'morning';
      break;
    case data.time.hour >= 18 && data.time.hour <= 21:
      timeOfDay = 'evening';
      break;
    case (data.time.hour > 21 && data.time.hour <= 24) || (data.time.hour >= 0 && data.time.hour < 5):
      timeOfDay = 'night';
      break;
    case data.time.hour > 11 && data.time.hour < 18:
      timeOfDay = 'day';
      break;
    default:
      timeOfDay = '';
  }
}

function determineTheSeason() {
  switch (data.time.month) {
    case 11:
    case 0:
    case 1:
      timeOfTheYear = 'winter';
      break;
    case 2:
    case 3:
    case 4:
      timeOfTheYear = 'spring';
      break;
    case 5:
    case 6:
    case 7:
      timeOfTheYear = 'summer';
      break;
    case 8:
    case 9:
    case 10:
      timeOfTheYear = 'autumn';
      break;
    default:
      timeOfTheYear = '';
  }
}

function getRandomNumber(min = 0, max = 100) {
  const num = Math.floor(min + Math.random() * (max + 1 - min));
  return num;
}

function loadPictures() {
  determineTimeOfDay();
  determineTheSeason();
  console.log(timeOfDay, timeOfTheYear);
  return fetch(
    `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c5147c8dda00e6d3b6010a9f73970df1&tags=weather,nature,${timeOfDay},${timeOfTheYear},-people,-women,-girl,-child,-children,-men,-religion&tag_mode=all&extras=url_h&format=json&nojsoncallback=1&per_page=100&media=photos&sort=relevance&content_type=1`,
  )
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse);
      let randomNumber = getRandomNumber(0, jsonResponse.photos.photo.length - 1);
      if (jsonResponse.photos.photo[randomNumber].url_h === undefined) {
        do {
          console.log('Перезапуск без фотки');
          randomNumber = getRandomNumber(0, jsonResponse.photos.photo.length - 1);
        } while (!jsonResponse.photos.photo[randomNumber].url_h);
      }
      data.image = jsonResponse.photos.photo[randomNumber].url_h;
    })
    .then(() => {
      const img = new Image();
      img.src = data.image;
      img.onload = () => {
        elementBody.style.backgroundImage = `url(${data.image})`;
      };
      return data;
    });
}

function fillDOMContent() {
  elementWeatherLocation.innerHTML = `${data.geocoding.city}, ${data.geocoding.country}`;
  elementCurrentTemp.innerHTML = `${Math.round(data.weather.currentTemp)}<span id="degree-sign">&#176</span>`;
  elementWeatherDescription.innerHTML = data.weather.currentDescription;
  elementWeatherFeelsLike.innerHTML = `${dictionary[currentLanguage].feelsLike}: ${Math.round(data.weather.currentFeelsLike)}&#176`;
  elementWeatherWind.innerHTML = `${dictionary[currentLanguage].wind}: ${Math.round(data.weather.currentWindSpeed)} ${dictionary[currentLanguage].windSpeed}`;
  elementWeatherHumidity.innerHTML = `${dictionary[currentLanguage].humidity}: ${data.weather.currentHumidity}&#37`;
  elementNext1DayTemp.innerHTML = `${Math.round(data.weather.nextFirstDayTemp)}&#176`;
  elementNext2DayTemp.innerHTML = `${Math.round(data.weather.nextSecondDayTemp)}&#176`;
  elementNext3DayTemp.innerHTML = `${Math.round(data.weather.nextThirdDayTemp)}&#176`;
  elementLatitude.innerHTML = `${dictionary[currentLanguage].latitude}: ${String(data.geocoding.latitude).split('.')[0]}&deg${String(data.geocoding.latitude).split('.')[1].slice(0, 2)}&#39`;
  elementLongitude.innerHTML = `${dictionary[currentLanguage].longitude}: ${String(data.geocoding.longitude).split('.')[0]}&deg${String(data.geocoding.longitude).split('.')[1].slice(0, 2)}&#39`;
}

function loadIcons() {
  elementCurrentIcon.src = `icons/${data.weather.currentIcon}.svg`;
  elementNext1DayIcon.src = `icons/${data.weather.nextFirstDayIcon}.svg`;
  elementNext2DayIcon.src = `icons/${data.weather.nextSecondDayIcon}.svg`;
  elementNext3DayIcon.src = `icons/${data.weather.nextThirdDayIcon}.svg`;
}

function loadMap() {
  if (document.documentElement.clientWidth > verticalScreenWidth) {
    elementMapContainer.style.height = `${elementNext3DayTemp.getBoundingClientRect().top}px`;
  }
  elementMap.replaceChildren();
  const myMap = new ymaps.Map('geolocation__map', {
    center: [data.geocoding.latitude, data.geocoding.longitude],
    zoom: 10,
    controls: ['zoomControl'],
  });
  document.querySelector('.ymaps-2-1-78-copyrights-pane').remove();
}

function enterSearchValue(event) {
  if (event.code === 'Enter') {
    controlWeather();
  }
}

function showHideMistakeMessage() {
  if (elementMistakesTint.hidden === false) {
    elementMistakesTint.hidden = true;
    elementTownInput.value = '';
    elementMistakesText.innerHTML = '';
  } else {
    elementMistakesTint.hidden = false;
    elementMistakesText.innerHTML = `${dictionary[currentLanguage].mistake}`;
  }
}

function rotationArrows() {
  elementRefreshButtonArrows.classList.add('arrows_rotation');
  setTimeout(() => elementRefreshButtonArrows.classList.remove('arrows_rotation'), 1000);
}

function Initialization() {
  loadSaveLanguage();
  loadSaveScale();
  const promise = new Promise((resolve) => {
    resolve(getLocationByIP());
  });
  promise
    .then((data) => getCoordinates(coordinatesIP))
    .then((data) => loadWeather(data))
    .then((data) => loadPictures(data))
    .then((data) => setDateAndTime(data))
    .then((data) => setCurrentWeatherScale(data))
    .then((data) => fillDOMContent(data))
    .then((data) => loadIcons(data))
    .then((data) => loadMap(data))
    .catch(() => showHideMistakeMessage());
}

function controlWeather() {
  const promise = new Promise((resolve) => {
    resolve();
  });
  promise
    .then((data) => (elementTownInput.value === '' ? getCoordinates(coordinatesIP) : getCoordinates(elementTownInput.value)))
    .then((data) => loadWeather(data))
    .then((data) => loadPictures(data))
    .then((data) => setDateAndTime(data))
    .then((data) => setCurrentWeatherScale(data))
    .then((data) => fillDOMContent(data))
    .then((data) => loadIcons(data))
    .then((data) => loadMap(data))
    .catch(() => showHideMistakeMessage());
}

Initialization();

elementRefreshButton.addEventListener('click', loadPictures);

elementRefreshButton.addEventListener('mousedown', rotationArrows);

elementLanguageButton.addEventListener('change', toggleCurrentLanguage);

elementTownInput.addEventListener('keydown', enterSearchValue);

elementSearchButton.addEventListener('click', controlWeather);

elementMistakesButton.addEventListener('click', showHideMistakeMessage);

elementsTemperatureButtons.forEach((button) => button.addEventListener('click', (element) => {
  currentScale = element.target.dataset.scale;
  toggleTemperatureButton();
}));
