let container = document.getElementById("weather")

let map = document.getElementById("gmap_canvas")

let Days = document.getElementById("Days")
let key = "df0dae628b95a27cdad8642dd1c2e0cb"
async function getWeather() {
    try {
        let city = document.getElementById("city").value;
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`)

        let data = await res.json();
        append(data)
    }
    catch (err) {
        console.log(err)
    }


}
let month;
let timeEle = document.createElement("p");
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]
function append(data) {
    container.innerHTML = ""
    setInterval(function () {
        let time = new Date()
        let month = time.getMonth();
        let date = time.getDate();
        let hours = time.getHours();
        let minuts = time.getMinutes();
        if (hours >= 13) {
            am_pm = "pm"
            hours = hours % 12
        } else if(hours==0) {
            am_pm = "am"
            hours = 12;
        }else{
            am_pm = "am"
        }
        if (minuts<10){
            minuts = "0"+minuts
        }
        timeEle.innerText = `${months[month - 1]} ${date} , ${hours}:${minuts}${am_pm}` 
    })
    let div = document.createElement("div")
    let name = document.createElement("h2");
    name.innerText = `${data.name}, ${data.sys.country}`;
    let temp = document.createElement("p");
    temp.innerText = `${Math.ceil(data.main.temp)}  °C`
    let humidity = document.createElement("p");
    humidity.innerText = `Humidity: ${data.main.humidity}%`
    let pressure = document.createElement("p");
    let icon = data.weather[0].icon
    pressure.innerText = `${data.main.pressure}hPa`
    let visibility = document.createElement("p");
    visibility.innerText = `Visibility: ${Math.round((data.visibility/1000)*10)/10} km`
    let wind = document.createElement("p");
    wind.innerText = `Wind: ${data.wind.speed}m/s`
    let cloud = document.createElement("p");
    cloud.innerText = `Cloud: `
    let min = document.createElement("p");
    min.innerText = `Min: ${Math.round(data.main.temp_min*10)/10}`

    let max = document.createElement("p");
    max.innerText = `Clouds: ${data.clouds.all}%`

    let span = document.createElement("span");
    let img = document.createElement("img");
    img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    span.append(img);
    span.append(temp)
    let feel = document.createElement("p");
    feel.innerText = `Feels like ${Math.floor(data.main.feels_like)} °C. ${data.weather[0].description}`
    feel.style.fontWeight = "bolder"
    feel.setAttribute("id","feel")

    div.setAttribute("id","data")


    div.append(humidity,visibility,wind,pressure,min,max)
    
    

    container.append(timeEle, name,span,feel,div)
    map.src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`
}


function success(pos) {
    const crd = pos.coords;
    let lon = crd.longitude;
    let lat = crd.latitude;
    Weather()
    dWeather()
    async function Weather(){
        try{
           let res =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
           let data = await res.json();
           if (data){
            append(data)
           }
        }
        catch(err){
            console.log(err)
        }
    }
    async function dWeather(){
        try{
            let res =  await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&cnt=8&units=metric`)
            let data = await res.json();
            console.log(data)
            if (data){
                daysWeather(data)
            }
        }
        catch(err){
            
        }
    }
  }
navigator.geolocation.getCurrentPosition(success)

let dayArr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
function daysWeather(data){
    Days.innerHTML = ""
    let days = data.list;
    console.log(days)
    days.forEach(function(ele,index){
        let d = new Date(ele.dt * 1000).getDay()
        console.log(d)
        if (index!=0){
            let div = document.createElement("div");
            let day = document.createElement("h3");
            let day_index = d+index;
            if (day_index>6){
                day_index = 0
            }
            day.innerText = dayArr[day_index]
            let img = document.createElement("img");
            img.src = `http://openweathermap.org/img/wn/${ele.weather[0].icon}@2x.png`
            let max = document.createElement("h4");
            max.innerText = `${ele.main.temp_max}°` 
            let min = document.createElement("p")
            min.innerText = `${ele.main.temp_min}°` 
            div.append(day,img,max,min)
            Days.append(div)
        }
    })
}