// navigator.language
const languageButton = document.getElementById('language-button');
const currentTime = document.getElementById('weather-time-value');
const currentDayShort = document.getElementById('weather__day-of-the-week');
const currentMonthDate = document.getElementById('weather__month-date');
const currentMonth = document.getElementById('weather__month');
const nextDay1 = document.getElementById('1-day-after__day-of-the-week');
const nextDay2 = document.getElementById('2-day-after__day-of-the-week');
const nextDay3 = document.getElementById('3-day-after__day-of-the-week');

let currentLanguage = 'en';

const dictionary = {
    en: {
        daysList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShortList: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
    ru: {
        daysList: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        daysShortList: ['Вск', 'Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Суб'],
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
    currentTime.innerHTML = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
    currentMonthDate.innerHTML = date;
    currentDayShort.innerHTML = dictionary[currentLanguage].daysShortList[day];
    currentMonth.innerHTML = dictionary[currentLanguage].monthList[month];
    nextDay1.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day+1)];
    nextDay2.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day+2)];
    nextDay3.innerHTML = dictionary[currentLanguage].daysList[checkForExtraDays(day+3)];
    setTimeout(setDateAndTime, 1000);
}

function addZero(n) {
    return n < 10 ? '0' + n : n;
}

function checkForExtraDays(n) {
    return n > 6 ? n - 7 : n;
}

function toggleCurrentLanguage() {
    currentLanguage = languageButton.value;
    localStorage.setItem('language', currentLanguage);
    setDateAndTime();
}

function loadSaveLanguage(){
    if (localStorage.getItem('language') === null) {
        localStorage.setItem('language', 'en');
    } else {
        currentLanguage = languageButton.value = localStorage.getItem('language');
    }
}
   

Initialization();

languageButton.addEventListener('change', toggleCurrentLanguage);