
// HTML内のid="city"のtextarea要素を取得
const textarea = document.getElementById("city");
const btn = document.querySelector(".search");

// textareaをクリックしたときにgetCity関数を実行
btn.addEventListener("click", () => getCity());

// textareaの現在の値をコンソールに出力（クリック時点では空かもしれません）
// console.log(textarea.value);
async function getResponse(){
  const myHeaders = new Headers();

  myHeaders.append("Authorization", "Bearer 01fe956db8d53db098f09b09ea97b199351cdfa4");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  return requestOptions;
}

async function getCity(){
  try{
    // const requestOptions = await getResponse();
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${textarea.value}&limit=2&appid=b4f5834a6e99afab79449a758d090683`);
    const item = await response.json();
    console.log(item)
  } catch (error) {
    console.error(error);
  }
}



console.log(getCity())
function Tabs() {
  var bindAll = function() {
  var menuElements = document.querySelectorAll('[data-tab]');
  for(var i = 0; i < menuElements.length ; i++) {
    menuElements[i].addEventListener('click', change, false);
  }
}

  var clear = function() {
    var menuElements = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElements.length ; i++) {
      menuElements[i].classList.remove('active');
      var id = menuElements[i].getAttribute('data-tab');
      document.getElementById(id).classList.remove('active');
    }
  }

  var change = function(e) {
    clear();
    e.target.classList.add('active');
    var id = e.currentTarget.getAttribute('data-tab');
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

var connectTabs = new Tabs();
