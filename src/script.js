import axios from 'axios';
import dayjs from "dayjs";
import ja from 'dayjs/locale/ja';
dayjs.locale(ja);
const apiKey = import.meta.env.VITE_API_KEY;

function $(selector){return document.querySelector(selector)};

const getHtmlAndDisplay = (selector, argument) =>  {
  $(selector).textContent= argument;
}

// 都市名を検索するボタンをクリックしたときにgetCity関数を実行
const btn = $(".city-search__button");　
btn.addEventListener("click", () => getCityData());

window.onload = () => {
  $('[data-tab="today-weather"]').click();
  document.addEventListener('DOMContentLoaded',getCityData());
}

async function getCityData(){
  try{
    const citySearchInput = $(".city-search__input");
    // HTTP通信(API通信)でサーバーからデータを取得
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${citySearchInput.value}&limit=2&appid=${apiKey}`);
    
    const item = response.data[0];
    // 分割代入
    const {local_names,lat,lon} = item;

    getWeatherForecastData(
      local_names.ja,
      lat,
      lon
    )
  } catch (error) {
    console.error(error);
  }
}

async function getWeatherForecastData(local_names,　lat, lon){
  try{
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const weatherData = response.data;
    const {main,wind} = weatherData;

    displayWeatherForecast(
      weatherData.weather[0].icon,
      local_names,
      main.temp_max,
      main.temp_min,
      main.humidity,
      wind.speed
    )
  } catch (error) {
    console.error(error);
  }
}

const displayWeatherForecast = (icon, local_names, temp_max, temp_min, humidity, wind) => {
  const weatherIcon = $(".weather-display__weather-icon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Math.round…整数になるまで四捨五入
  const weatherObject =[
    {classname:`.weather-display__city-name`, argument:local_names},
    {classname:`.temp-max`, argument:`${Math.round(temp_max)}℃`},
    {classname:`.temp-min`, argument:`${Math.round(temp_min)}℃`},
    {classname:`.level-of-humidity`, argument:`${humidity}%`} ,
    {classname:`.wind-speed`, argument:`${wind}m/s`}
  ]

  weatherObject.forEach(e => {
    getHtmlAndDisplay(e.classname,e.argument);
  });
}

const btn5days= $('[data-tab="5days-weather"]');
btn5days.addEventListener("click", () => get5DaysWeatherForecastData());

async function get5DaysWeatherForecastData(){
  try {
    const cities = [
      // 左の表の都市
      { name: "札幌市", lat: 43.061936, lon:  141.3542924,cssName: "Sapporo"},
      { name: "秋田市", lat: 39.7197629, lon: 140.1034669,cssName: "Akita"} ,
      { name: "仙台市", lat: 38.2677554, lon: 140.8691498,cssName: "Sendai"},
      { name: "東京都", lat: 35.6768601, lon: 139.7638947,cssName: "Tokyo"},
      { name: "金沢市", lat: 36.561627, lon: 136.6568822,cssName: "Kanazawa"},
      // 右の表の都市
      { name: "名古屋市", lat: 35.1851045, lon: 136.8998438,cssName: "Nagoya"},
      { name: "大阪市", lat: 34.6937569, lon: 135.5014539,cssName: "Osaka"},
      { name: "広島市", lat: 34.3916058, lon: 132.4518156,cssName: "Hiroshima"},
      { name: "福岡市", lat: 33.5898988, lon: 130.4017509,cssName: "Fukuoka"},
      { name: "那覇市", lat: 26.2122345, lon: 127.6791452,cssName: "Naha"}
    ];

    // for (変数 of 配列)配列をループする
    for (const city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`);
      const weatherData = await response.data;
      
      // match…文字列または正規表現を検索可能/substringはAPIが変更した際、対応できなくなるため使用不可
      const regex =  /([01][0-9]|2[0-3]):00:00/g;
      const firsForecastInfo = weatherData.list[0].dt_txt.match(regex);

      // https://route-zero.com/recruit/route/1058/
      // 「”a”を含む商品名」だけを表示したい場合の箇所参考
      // https://step-learn.com/article/javascript/197-array-del-null.html
      // filterはnullを削除してくれる仕様/trueのものをfilterが戻り値として認識して返す
      const timeArray = weatherData.list.filter((forecastInfo) => {
        const firsForecastInfoTime =  forecastInfo.dt_txt.match(regex);

        // 上から順にtrueかfalseを返す
        const isTimeMatch =firsForecastInfo[0] === firsForecastInfoTime[0];
        return isTimeMatch
      })

      // https://x.gd/ooESF
      // ブラケット記法…[ ]（ブラケット）を使ってプロパティにアクセスする方法
      // プロパティ名に変数を与えることができる
      timeArray['cityName'] = weatherData.city.name;
      display5DaysWeather(city.cssName,timeArray)
    }
  } catch (error) {
    console.error(error);
  };
  getDateAndDay()
}  


const display5DaysWeather = (cssName,timeArray)　=>　{
  for (let i = 0; i <5; i++){
    const weatherIcon =$(`.${cssName}-icon${i}`);
    const {main,weather}=timeArray[i];
    
    weatherIcon.src =`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    
    const temp = [
      {classname:"max",tempData:main.temp_max},
      {classname:"min",tempData:main.temp_min}
    ]

    temp.forEach(e=> {
      getHtmlAndDisplay(`.${cssName}-temp${i}-temp-${e.classname}`,`${Math.round(e.tempData)}`);
    })
  }
} 

const getDateAndDay= ()=> {
  // https://anotools.com/javascript/1883/
  // https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1046486670
  // 今日の日付取得
  // Fri Jun 13 2025 16:15:47 GMT+0900 (日本標準時)
  const today = dayjs();
  
  for (let i = 0; i <5; i++) {
    const targetDate = today.add(i, "day"); 
    const date = targetDate.date();
    // 曜日が日～土で0～6で番号が降られているので変換し、取得
    const weekday=targetDate.format("dd"); 

    const TablePosition =[`.right-day${i}`,`.left-day${i}`]

    TablePosition.forEach(e => {
      getHtmlAndDisplay(e,`${date} (${weekday})`);
    })
  }
}

const reloadBtn = $('.reload-btn');
reloadBtn.addEventListener("click", () =>  reloadMessage());

const reloadMessage = ()=> {
  get5DaysWeatherForecastData();
  getHtmlAndDisplay("reload-message","天気の情報を更新しました");

  // 3秒後にメッセージを消す
  setTimeout(function() {
    getHtmlAndDisplay("reload-message","")
  }, 3000);
}

const Tabs = () =>{
  const bindAll = function() {
    const tabElements = document.querySelectorAll('[data-tab]');
    for(let i = 0; i < tabElements.length ; i++) {
      tabElements[i].addEventListener('click', change, false);
    }
  }

  const clear = function() {
    const tabElements = document.querySelectorAll('[data-tab]');
    for(let i = 0; i < tabElements.length ; i++) {
      tabElements[i].classList.remove('active','text-[#ff4200]');
      const id = tabElements[i].getAttribute('data-tab');
      //  Element インターフェイスのメソッドで、この要素の指定された属性の値を返します
      document.getElementById(id).classList.remove('active');
    }
  }

  const change = function(e) {
    clear();
    e.target.classList.add('active');
    var id = e.currentTarget.getAttribute('data-tab');
    //currentTarget…常に実行中のアクションが登録された要素が取得される
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

Tabs();
