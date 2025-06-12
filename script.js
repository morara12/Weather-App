
// HTML内のid="city"のtextarea要素を取得
const citySearchInput = document.querySelector(".city-search__input");
const btn = document.querySelector(".city-search__button");

// textareaをクリックしたときにgetCity関数を実行
btn.addEventListener("click", () => getCityData());

// const citySearchInput = document.querySelector(".city-search__input");

// async function getResponse(){
//   const myHeaders = new Headers();

//   myHeaders.append("Authorization", "Bearer");

//   const requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     redirect: "follow"
//   };
//   return requestOptions;
// }

// トークン呼び出し
async function  getToken(){
  const response  = await fetch('./config.json');
  const token = await response.json();

  return token.openWeatherAccessToken;
}

async function getCityData(){
  try{
    // const requestOptions = await getResponse();
    const openWeatherAccessToken = await getToken()
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${citySearchInput.value}&limit=2&appid=${openWeatherAccessToken}`);
    const item = await response.json();

    getWeatherforecastData(
      openWeatherAccessToken,
      item[0].local_names.ja,
      item[0].lat,
      item[0].lon
    )
  } catch (error) {
    console.error(error);
  }
}

// const requestOptions = {
//   method: "GET",
//   redirect: "follow"
// };

async function getWeatherforecastData(openWeatherAccessToken,local_names,lat,lon){
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAccessToken}`,)
    const weatherData = await response.json()

    displayWeatherForecast(
      weatherData.weather[0].icon,
      local_names,
      weatherData.main.temp_max,
      weatherData.main.temp_min,
      weatherData.rain
    )
  } catch (error) {
    console.error(error);
  }
}

const displayWeatherForecast = function(icon,local_names,temp_max,temp_min,rain){
  const weatherIcon = document.querySelector(".weather-display__weather-icon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherDisplayCityName = document.querySelector(".weather-display__city-name");
  weatherDisplayCityName.textContent = local_names;

  const tempMax = document.querySelector(".temp-max");
  tempMax.textContent = `${Math.round(temp_max - 273.15)}℃`;


  const tempMin = document.querySelector(".temp-min");
  tempMin.textContent = `${Math.round(temp_min - 273.15)}℃`;

  const precipitation = document.querySelector(".precipitation");
  if (rain === undefined){
    precipitation.textContent = "ー"
  }else{
    precipitation.textContent = `${rain["1h"]}mm`
  } 
}

function Tabs() {
  var bindAll = function() {
  var menuElements = document.querySelectorAll('[data-tab]');
  for(var i = 0; i < menuElements.length ; i++) {
    menuElements[i].addEventListener('click', change, false);
  }
}

  const clear = function() {
    var menuElements = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElements.length ; i++) {
      menuElements[i].classList.remove('active');
      var id = menuElements[i].getAttribute('data-tab');
      document.getElementById(id).classList.remove('active');
    }
  }

  const change = function(e) {
    clear();
    e.target.classList.add('active');
    var id = e.currentTarget.getAttribute('data-tab');
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

var connectTabs = new Tabs();
