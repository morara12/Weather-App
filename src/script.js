import axios from 'axios';
import dayjs from "dayjs";
import '/src/style.css'
// 日本時間に変換
import ja from "dayjs/locale/ja";
// 日本語化
dayjs.locale(ja);

// HTML内のid="city"のtextarea要素を取得
const citySearchInput = document.querySelector(".city-search__input");
const btn = document.querySelector(".city-search__button");

// textareaをクリックしたときにgetCity関数を実行
btn.addEventListener("click", () => getCityData());

const todayWeather = document.querySelector('[data-tab="today-weather"]');
// 標準で、今日の天気を表示
window.onload = function() {
  todayWeather.click();
  // https://zenn.dev/antez/books/6da596a697aa86/viewer/71cd05
  // 発火のタイミングも細かく調整できる
  // DOMContentLoaded: ウェブブラウザーがDOMを構築したら発火
  document.addEventListener('DOMContentLoaded',getCityData());
}

// トークン呼び出し
async function  getToken(){
  // async/await 順番通りに動かす/async functionは呼び出されるとPromiseを返す。
  // PromiseとはJavaScriptにおいて、非同期処理の操作が完了したときに結果を返すもの
  // Promiseは処理が実行中の処理を監視し、処理が問題なく完了すればresolve、反対に問題があればrejectを呼び出してメッセージを表示します。
  const tokenForm = document.getElementById("token-form");

  return tokenForm.value
}

// ユーザーが都市名が入力することにより、緯度経度の情報の取得
async function getCityData(){
  // try…catch文は、予想していない異常によりエラーが発生するような場面で意図的に回避するための処理
  try{
    // 例外が発生する可能性のある処理
    const openWeatherAccessToken = await getToken()
    // HTTP通信(API通信)でサーバーからデータを取得
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${citySearchInput.value}&limit=2&appid=${openWeatherAccessToken}`);
    const item = response.data;

    getWeatherforecastData(
      openWeatherAccessToken,
      item[0].local_names.ja,
      item[0].lat,
      item[0].lon
    )  
  } catch (error) {
    // 例外が発生した場合の処理
    console.error(error);
  }
}

// 今日の天気の情報
async function getWeatherforecastData(openWeatherAccessToken,local_names,lat,lon){
  try{
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAccessToken}`)
    const weatherData = response.data;

    displayWeatherForecast(
      weatherData.weather[0].icon,
      local_names,
      weatherData.main.temp_max,
      weatherData.main.temp_min,
      weatherData.main.humidity,
      weatherData.wind.speed,
    )
  } catch (error) {
    console.error(er箇所ror);
  }
}

// 今日の天気をhtmlで表示するための処理
const displayWeatherForecast = function(icon,local_names,temp_max,temp_min,humidity,wind){
  const weatherIcon = document.querySelector(".weather-display__weather-icon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherDisplayCityName = document.querySelector(".weather-display__city-name");
  // let element = document.querySelector('div');
  // console.log(element.textContent);
  // htmlの文言を確認することも可能
  weatherDisplayCityName.textContent = local_names;

  const tempMax = document.querySelector(".temp-max");

  // Math.round…整数になるまで四捨五入
  // https://zenn.dev/shimpo/articles/open-weather-map-go-20250209
  // https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11130406411
  // デフォルトでケルビン（動のない状態が0K=-273.15℃(絶対零度)）（K）表示なので、摂氏（水の凝固点を基準）（℃）に変換するために、
  // 273.15度引く必要がある
  tempMax.textContent = `${Math.round(temp_max - 273.15)}℃`;

  const tempMin = document.querySelector(".temp-min");
  tempMin.textContent = `${Math.round(temp_min - 273.15)}℃`;
  
  // 湿度
  const levelOfHumidity = document.querySelector(".level-of-humidity");
  levelOfHumidity.textContent = `${humidity}%`

  // 風速　 m/s
  const windSpeed = document.querySelector(".wind-speed");
  windSpeed.textContent = `${wind}m/s`
}

const  btn5days= document.querySelector('[data-tab="5days-weather"]');
btn5days.addEventListener("click", () => get5DaysWeatherForecastData());

async function get5DaysWeatherForecastData(){
  try {
    const cities = [
      // 左の表の都市
      { name: "札幌市", lat: 43.061936, lon:141.3542924, cssName: "Sapporo"},
      { name: "秋田市", lat: 39.7197629, lon: 140.1034669, cssName: "Akita"} ,
      { name: "仙台市", lat: 38.2677554, lon: 140.8691498, cssName: "Sendai"},
      { name: "東京都", lat: 35.6768601, lon: 139.7638947, cssName: "Tokyo"},
      { name: "金沢市", lat: 36.561627, lon: 136.6568822, cssName: "Kanazawa"},
      // 右の表の都市
      { name: "名古屋市", lat: 35.1851045, lon: 136.8998438, cssName: "Nagoya"},
      { name: "大阪市", lat: 34.6937569, lon: 135.5014539, cssName: "Oosaka"},
      { name: "広島市", lat: 34.3916058, lon: 132.4518156, cssName: "Hirosima"},
      { name: "福岡市", lat: 33.5898988, lon: 130.4017509, cssName: "Hukuoka"},
      { name: "那覇市", lat: 26.2122345, lon: 127.6791452, cssName: "Naha"},
    ];

    const openWeatherAccessToken = await getToken();
    // for (変数 of 配列)配列をループする
    for (const city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${openWeatherAccessToken}&units=metric`);
      const weatherData = await response.data;
      // https://www.javadrive.jp/regex-basic/sample/index6.html
      const regex =  /([01][0-9]|2[0-3]):00:00/g;

      // match…文字列または正規表現を検索可能/
      const firsForecastInfo = weatherData.list[0].dt_txt.match(regex);
      // 正規表現の方がおすすめ。substringはAPIが変更した際、対応できなくなるため

      // 変数名timeは時間だけのデータを取ってきてると勘違いするのでforecastInfoに変更
      // includes() は Array インスタンスのメソッド特定の要素が配列に含まれているかどうかtrue または false で返す
      // https://route-zero.com/recruit/route/1058/
      // 「”a”を含む商品名」だけを表示したい場合の箇所参考

      // https://step-learn.com/article/javascript/197-array-del-null.html
      const timeArray = weatherData.list.filter((forecastInfo) => {
        // filter
        const firsForecastInfotime =  forecastInfo.dt_txt.match(regex);
      
        const isTimeMatch =firsForecastInfo[0] === firsForecastInfotime[0] 
        // 上から順にtrueかfaiseを返す
        return isTimeMatch
        // trueのものをfilterが認識して返す
      })

      // filterはnullを削除してくれる仕様なので、戻り値で結果として出す

      // https://www.freecodecamp.org/japanese/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/
      // 配列の中の各オブジェクト追加
      // ブラケット記法…[ ]（ブラケット）を使ってプロパティにアクセスする方法
      // ブラケット記法は、プロパティ名に変数を与えることができる
      
      timeArray['cityName'] = weatherData.city.name;
      display5Daysweather(city.cssName,timeArray)
    }
  } catch (error) {
    console.error(error);
  };
  getDateAndDay()
}  


const display5Daysweather = function(cssName,timeArray){
  for (let i = 0; i <5; i++){
    const weatherIcon =document.querySelector(`.${cssName}-icon${i}`)

    weatherIcon.src =`https://openweathermap.org/img/wn/${timeArray[i].weather[0].icon}@2x.png`;

    const tempMax = document.querySelector(`.${cssName}-temp${i}-temp-max`);

    tempMax.textContent =  Math.round(timeArray[i].main.temp_max);

    const tempMin = document.querySelector(`.${cssName}-temp${i}-temp-min`);

    tempMin.textContent = Math.round(timeArray[i].main.temp_min);
  }
} 

const getDateAndDay= function () {

  // https://anotools.com/javascript/1883/
  // https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1046486670
  // 今日の日付取得
  // Fri Jun 13 2025 16:15:47 GMT+0900 (日本標準時)
  const today = dayjs();
  
  for (let i = 0; i <5; i++) {
    const targetDate = today.add(i, "day"); 
    // 配列になってるので１ではなく0スタート

    const date = targetDate.date()
    // (必要な情報を取得するため日付を取る2025-06-26T10:17:16+09:00)
    // 曜日が日～土で0～6で番号が降られているので変換し、取得
    const weekdy =targetDate.format("dd"); 

    const tableRight = document.querySelector(`.right-day${i}`);
    const tableLeft = document.querySelector(`.left-day${i}`);

    tableRight.innerHTML = `${date} (${weekdy})`;
    tableLeft.innerHTML = `${date} (${weekdy})`;
  }

}

const reloadBtn = document.querySelector('.reload-btn');
reloadBtn.addEventListener("click", () =>  reloadMesseage());

const reloadMesseage= function () {
    get5DaysWeatherForecastData()

    // メッセージを表示
    document.querySelector(".reload-messeage").innerHTML  = "天気の情報を更新しました";

    // 3秒後にメッセージを消す
    setTimeout(function() {
      document.querySelector(".reload-messeage").textContent = "";
    }, 3000);
}

function Tabs() {
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
