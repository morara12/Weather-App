
import axios from 'axios';
import dayjs from "dayjs";
// 日本時間に変換
import ja from "dayjs/locale/ja";
// 日本語化
dayjs.locale(ja);  

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
  const response  = await axios.get('/src/config.json');
  const token = response.data;

  return token.openWeatherAccessToken;
}

async function getCityData(){
  try{
    // const requestOptions = await getResponse();
    const openWeatherAccessToken = await getToken()
    // HTTP通信(API通信)でサーバーからデータを取得
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${citySearchInput.value}&limit=2&appid=${openWeatherAccessToken}`);
    const item = response.data;

    console.log("緯度",item[0].local_names.ja)
    console.log("緯度",item[0].lat)
    console.log("経度",item[0].lon)
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
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAccessToken}`)
    const weatherData = response.data;

    displayWeatherForecast(
      weatherData.weather[0].icon,
      local_names,
      weatherData.main.temp_max,
      weatherData.main.temp_min,
      weatherData.main.humidity,
      weatherData.wind.speed,
      // weatherData.main.grnd_level
    )
  } catch (error) {
    console.error(error);
  }
}

const displayWeatherForecast = function(icon,local_names,temp_max,temp_min,humidity,wind,grnd_level){
  const weatherIcon = document.querySelector(".weather-display__weather-icon");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherDisplayCityName = document.querySelector(".weather-display__city-name");
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
      { name: "札幌市", lat: 43.061936, lon:  141.3542924 },
      { name: "秋田市", lat: 39.7197629, lon: 140.1034669 },
      // { name: "仙台市", lat: 38.2677554, lon: 140.8691498 },
    ];

    const openWeatherAccessToken = await getToken();
    let test = [];
    // for (変数 of 配列)配列をループする
    for (const city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${openWeatherAccessToken}&units=metric`);
      const weatherData = await response.data;
      // console.log("五日間",weatherData)

      const firstElement = weatherData.list[0].dt_txt
      // https://www.javadrive.jp/regex-basic/sample/index6.html
      
      const regex =  /([01][0-9]|2[0-3]):00:00$/;

      const firstTime = firstElement.match(regex);
      
      console.log("最初の時間",firstTime)


      // https://www.sejuku.net/blog/25730
      // 文字列を分割したり任意の箇所を抽出したりする際に使用
      // 開始位置を指定しなければ今回だと11行目の単語から最後まで引っ張っている
      // const firstTime = firstElement.test（regex
      // // 現場的にAPIの書き方が変更したときまずいのでお勧めしない 

      // marchが数字に対応していないため、Stringで文字列に変換
      
      // match…文字列または正規表現を検索可能/
      const timeArry = weatherData.list.filter(forecastInfo=> forecastInfo.dt_txt.match(regex) === firstTime);

      // const timeArry = weatherData.list.filter(time=> time.dt_txt.match(stringFirstTime));
      // 時間だけのデータを取ってきてると勘違いするのでダメ
      // 単語ごとに分ける
        console.log("timeArry",timeArry)

      // https://www.freecodecamp.org/japanese/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/
      // 配列の中の各オブジェクト追加
      // ブラケット記法…[ ]（ブラケット）を使ってプロパティにアクセスする方法
      // ブラケット記法は、プロパティ名に変数を与えることができる


      // 配列どんどん増えるので却下…
     
        timeArry['city.name'] = weatherData.city.name;
        // console.log(timeArry)
        // test.push(item); 
      // 無駄なので配列の最後だけ
    // 返り値がないのでmapに変更
    // const updatedArray = timeArry.map(item => {
    // item['city.name'] = weatherData.city.name;
    //   return item;
    // });


    }

  } catch (error) {
    console.error(error);
  };
  // console.log("test",test)
  // display5Daysweather(updatedArray)
  getDateAndDay()

}  


const display5Daysweather = function(updatedArray){
  console.log(updatedArray)
  const b =timeArry
  const a =document.querySelectorAll(`.${b.city.name}`)
  console.log("テスト",a)
  
} 


//   // 気温に絞る
//   // get5DaysWeatherForecastDataから欲しい配列の取得
// 札幌なら札幌の都市の配列取得したい/どこでわかるのか？→// 配列の中の各オブジェクトを追加してみる⇒成功
// 秋田なのに札幌のデータ入ってる。どうすれば？
// ⇒for constを正しく理解できていないか☑/☑して問題なければ、発動タイミングがおかしいのかも？要チェック
// ⇒緯度経度で観たら問題ない/ｄｔはなに?時間
// クラス名はデータはcitynem+クラス名に配列の番号を追加かまたはidをJSで追加し、クラス名に反映
// その後/htmlで追加させる

// timeArryが外に持ち出せない

//   weatherData.list[0].main.temp_min= 

const getDateAndDay= function () {

  // https://anotools.com/javascript/1883/
  // https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1046486670
  // 今日の日付取得
  // Fri Jun 13 2025 16:15:47 GMT+0900 (日本標準時)


  
  const today = dayjs();
  const dow = ["日","月","火","水","木","金","土"];

  for (let i = 0; i <5; i++) {
    const targetDate = today.add(i, "day"); 
    // 配列になってるので１ではなく0スタート

    const date = targetDate.date()
    // (必要な情報を取得するため日付を取る2025-06-26T10:17:16+09:00)
     // 曜日が日～土で0～6で番号が降られているので変換し、取得
    const weekdy =targetDate.format("dd"); 

    const table = document.querySelector(`.Day${i}`);
  
    table.innerHTML = `${date} (${weekdy})`;
    

    // setDate（今日を一日足した日にちをセット）
    // https://rinyan-7.com/gas/date_setdate/
    // today.setDate(today.date() + 1);
  }
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
      tabElements[i].classList.remove('active');
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
