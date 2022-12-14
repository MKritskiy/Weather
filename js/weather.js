const temperatureUnit = "°";
const humidityUnit = " %";
const pressureUnit = " мм. рт. ст.";
const windUnit = " м/с";
let startingCity = "Москва";
const url =
  "https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,surface_pressure,windspeed_10m,winddirection_10m&windspeed_unit=ms";
let hour = new Date().getHours();
async function getData() {
  let response = await fetch(url);

  if (response.ok) {
    let jsonData = response.json();
    return jsonData;
  } else {
    alert("Error: " + response.status);
  }
}


function convertPressure(value) {
  return (value / 1.33).toFixed();
}
function getValueWithUnit(value, unit) {
  return `${value}${unit}`;
}
function getTemperature(value) {
  var roundedValue = value.toFixed();
  return getValueWithUnit(roundedValue, temperatureUnit);
}
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

function getHoursString(dateTime) {
  let date = new Date(dateTime);
  let hours = date.getHours().pad();

  return hours;
}

function render(data) {
  renderCity(data);
  renderCurrentTemperature(data);
  renderCurrentDescription(data);
  renderForecast(data);
  renderDetails(data);
}

function renderCity(data) {
  let cityName = document.querySelector(".current__city");
  cityName.innerHTML = "Москва";
}

function renderCurrentTemperature(data) {
  let tmp = data.hourly.temperature_2m[hour];
  let currentTmp = document.querySelector(".current__temperature");
  currentTmp.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data) {
  let tmp = data.hourly.weathercode[hour];
  if (tmp == "0") tmp = "Ясно";
  if (tmp == "1" || tmp == "2") tmp = "Переменная облачность";
  if (tmp == "3") tmp = "Пасмурно";
  if (tmp == "45" || tmp == "48") tmp = "Туман";
  if (tmp == "51" || tmp == "53" || tmp == "55" || tmp == "56" || tmp == "57")
    tmp = "Моросит";
  if (tmp == "61" || tmp == "63" || tmp == "65" || tmp == "66" || tmp == "67")
    tmp = "Дождь"; //Rain
  if (parseInt(tmp) >= 71 && parseInt(tmp) < 80) tmp = "Снег";
  else if (parseInt(tmp) >= 80 && parseInt(tmp) < 85) tmp = "Дождь";
  else if (parseInt(tmp) >= 85 && parseInt(tmp) < 95) tmp = "Гроза";
  else if (parseInt(tmp) >= 95) tmp = "Гроза";
  let description = document.querySelector(".current__description");
  description.innerHTML = tmp;
}

function renderForecast(data) {
  let forecastDataContainer = document.querySelector(".forecast");
  let forecasts = "";

  for (let i = hour; i < hour + data.hourly.time.length - 6 * 24 - 10; i++) {
    let tmp = data.hourly.weathercode[i];
    let icon;
    if (tmp == "0") icon = "01d";
    else if (tmp == "1" || tmp == "2") icon = "02d";
    else if (parseInt(tmp) >= 3 && parseInt(tmp) < 45) icon = "03d";
    else if (parseInt(tmp) >= 45 && parseInt(tmp) < 51) icon = "50d";
    else if (parseInt(tmp) >= 51 && parseInt(tmp) < 61) icon = "10d";
    else if (parseInt(tmp) >= 61 && parseInt(tmp) < 71) icon = "09d";
    else if (parseInt(tmp) >= 71 && parseInt(tmp) < 80) icon = "13d";
    else if (parseInt(tmp) >= 80 && parseInt(tmp) < 85) icon = "09d";
    else if (parseInt(tmp) >= 85 && parseInt(tmp) < 95) icon = "13d";
    else if (parseInt(tmp) >= 95) icon = "11d";
    let temp = getTemperature(data.hourly.temperature_2m[i]);
    let hours = i == hour ? "Сейчас" : data.hourly.time[i].slice(11);

    let template = `<div class="forecast__item">
        <div class="forecast__time">${hours}</div>
        <div class="forecast__icon icon__${icon}"></div>
        <div class="forecast__temperature">${temp}</div>
      </div>`;
    forecasts += template;
  }
  forecastDataContainer.innerHTML = forecasts;
}

function renderDetails(data) {
  let item = data.hourly;
  let pressureValue = convertPressure(item.surface_pressure[hour]);
  let pressure = getValueWithUnit(pressureValue, pressureUnit);
  let humidity = getValueWithUnit(item.relativehumidity_2m[hour], humidityUnit);
  let feels_like = getTemperature(item.apparent_temperature[hour]);
  let wind = getValueWithUnit(item.windspeed_10m[hour], windUnit);

  renderDetailsItem("feelslike", feels_like);
  renderDetailsItem("humidity", humidity);
  renderDetailsItem("pressure", pressure);
  renderDetailsItem("wind", wind);
}

function renderDetailsItem(className, value) {
  container = document
    .querySelector(`.${className}`)
    .querySelector(".details__value");
  container.innerHTML = value;
}

function periodicTasks() {
  setInterval(start, 6000000);
}
function start() {
  getData().then((data) => {
    currentData = data;
    render(data);
    notification(data);
    periodicTasks();
  });
}


let isChecked = false;
document.getElementById("back").style.animation = "none";
var checkbox = document.querySelector("input[name=checkbox]");
checkbox.addEventListener("change", function () {
  if (isChecked == false) {
    document.getElementById("back").style.animation =
      "burgerBackground__Ani 0.4s forwards normal";
    isChecked = true;
  } else {
    document.getElementById("back").style.animation =
      "burgerBackgroundClose__Ani 0.4s forwards normal";
    isChecked = false;
  }
});
const mediaInQuery = window.matchMedia("(max-width: 350px)");
const mediaOutQuery = window.matchMedia(
  "(min-width: 351px) and (max-width: 768px)"
);
function handleTabletInChange(e) {
  if (e.matches) {
    let $navbar = document.querySelector(".navbar");
    let $navbar__wrap = document.querySelector(".navbar__wrap");
    $navbar__wrap.innerHTML = " ";
    let $menu__items = document.querySelector(".menu__items");
    $menu__items.innerHTML = `
    <li class="search__container">
      <input type="search" id="search" maxlength="30" minlength="2" placeholder="Город" name="q" autocomplete="off" required="">
    </li>
    <li><a href="main.html">Главная</a></li>
    <li><a href="today.html">Сегодня</a></li>
    <li><a href="twoweeks.html">Две недели</a></li>
    <li><a href="month.html">Месяц</a></li>
    <li><a href="contacts.html">Контакты</a></li>  
    `;
  }
}
function handleTabletOutChange(e) {
  if (e.matches) {
    let $navbar = document.querySelector(".navbar");
    let $navbar__wrap = document.querySelector(".navbar__wrap");
    $navbar__wrap.innerHTML = `
        <ul class="navbar__menu">
            <li><a href="main.html">Главная</a></li>
            <li><a href="today.html">Сегодня</a></li>
            <li><a href="twoweeks.html">Две недели</a></li>
            <li><a href="month.html">Месяц</a></li>
            <li><a href="contacts.html">Контакты</a></li>
        </ul>
        <form class="search__container">
            <input type="search" id="search" maxlength="30" minlength="2" placeholder="Город" name="q" autocomplete="off" required="">
            <button class="search__button" type="submit"></button>
            <!-- <span class="search__icon"></span> -->
        </form>
    `;
    let $menu__items = document.querySelector(".menu__items");
    $menu__items.innerHTML = `
    <li><a href="main.html">Главная</a></li>
    <li><a href="today.html">Сегодня</a></li>
    <li><a href="twoweeks.html">Две недели</a></li>
    <li><a href="month.html">Месяц</a></li>
    <li><a href="contacts.html">Контакты</a></li>  
    `;
  }
}

mediaInQuery.addListener(handleTabletInChange, mediaInQuery);
mediaOutQuery.addListener(handleTabletOutChange, mediaOutQuery);
handleTabletInChange(mediaInQuery);
handleTabletOutChange(mediaOutQuery);
start();
