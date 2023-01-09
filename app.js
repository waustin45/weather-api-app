const apieKey = '8df524fcfcbbb5a966a64726ff3d0434'

// global variables 
const inputBar = document.querySelector('#input')
const inputValue = inputBar.value
console.log(inputValue)
let long = 0,
     lat = 0;
const cityList = document.querySelector('.searched-cities')
const cardDiv = document.querySelector('.card-div')
const topInfo = document.querySelector('.top-info')
const searchBtn = document.querySelector('.search-btn')
const infoHead = document.querySelector('.info-head')
const temp = document.querySelector('.temp')
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')
const clearBtn = document.querySelector('.clear-btn')
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var ddRevised = String(today.getDate()).padStart(2, '0') 
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
// array to hld the searched cities
let citiesArray = [];
//function to add searched cities to local storage
searchBtn.addEventListener('click', saveSearch)
searchBtn.addEventListener('click' , fetchData)
function saveSearch () {
    const value = inputBar.value
    
    if(localStorage.getItem('cities')) {
        citiesArray = JSON.parse(localStorage.getItem('cities'))
       console.log(citiesArray + "in if statement")

   } else {
       citiesArray = []
   }
    citiesArray.push(value)
    const newCitiesMap =  citiesArray.map(info => {
        return `<li><button class="searched-city-btn new">${info}</button></li>`
    }).join("")
    if(newCitiesMap) {
        cityList.innerHTML = newCitiesMap
    }else {
        citiesArray =[]
    }
    
    console.log(citiesArray)
    localStorage.setItem('cities', JSON.stringify(citiesArray))
}
//makes search history visible to user
function showSearches () {
    const newCitiesArray = JSON.parse(localStorage.getItem('cities'))
    
         const citiesMap =  newCitiesArray.map(info => {
        return `<li><button class="searched-city-btn">${info}</button></li>`
    
    }).join("")
     
   
   
    console.log(citiesMap)
    
    console.log(citiesMap)
    cityList.innerHTML = citiesMap
        
    
    
}
showSearches()
// functionto fetch weather datat from api
function fetchData () {
    
    const item = inputBar.value
    const urlForCity = `http://api.openweathermap.org/geo/1.0/direct?q=${item}&limit=1&appid=${apieKey}`
    fetch(urlForCity).then(res => res.json()).then(data => {
        console.log(data)
        lat = data[0].lat
        long = data[0].lon
        console.log("lat " + lat, "lon " + long)
        // fetch function for weather data 
        function weatherData () {
            const urlForLatLong = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=alerts&appid=${apieKey}`
            fetch(urlForLatLong).then(res => res.json()).then(weather => {
                console.log(weather)
                infoHead.innerHTML = data[0].name + " " + today
                temp.innerHTML = " " + weather.current.temp + "ºF"
                wind.innerHTML = " " + weather.current.wind_speed + " MPH"
                humidity.innerHTML = " " + weather.current.humidity + " %"
                
               cardDiv.innerHTML = weather.daily.splice(3).map( info => {
                    return `<div class="card">
                    <h3>${info.weather[0].main}</h3>
                    <img src="http://openweathermap.org/img/wn/${info.weather[0].icon}.png"></img>
                    <div> Temp: <span>${info.temp.day}</span></div>
                    <div> Wind: <span>${info.wind_speed}</span></div>
                    <div> Humidity: <span>${info.humidity}</span></div>
                    </div>`
                }).join('')
                
            })
        }
        weatherData()
    })
    console.log("lat " + lat, "lon " + long, "this is returned")
    
}
// fetches weather data for searched items. press searched item to trigger
function fetchSearchedData () {
    console.log('works')
    const searchedBtn = document.querySelectorAll('.searched-city-btn')
    searchedBtn.forEach(each => {
        const buttonItem = each.textContent
        console.log(buttonItem)
        each.addEventListener('click', () => {
            const urlForCity = `http://api.openweathermap.org/geo/1.0/direct?q=${buttonItem}&limit=1&appid=${apieKey}`
            fetch(urlForCity).then(res => res.json()).then(data => {
                console.log(data)
                lat = data[0].lat
                long = data[0].lon
                console.log("lat " + lat, "lon " + long)
                // fetch function for weather data 
                function weatherData () {
                    const urlForLatLong = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=alerts&appid=${apieKey}`
                    fetch(urlForLatLong).then(res => res.json()).then(weather => {
                        console.log(weather)
                        infoHead.innerHTML = data[0].name + " " + today
                        temp.innerHTML = " " + weather.current.temp + "ºF"
                        wind.innerHTML = " " + weather.current.wind_speed + " MPH"
                        humidity.innerHTML = " " + weather.current.humidity + " %"
                        
                        cardDiv.innerHTML = weather.daily.splice(3).map( info => {
                            return `<div class="card">
                            <h3>${info.weather[0].main}</h3>
                            <img src="http://openweathermap.org/img/wn/${info.weather[0].icon}.png"></img>
                            <div> Temp: <span>${info.temp.day}</span></div>
                            <div> Wind: <span>${info.wind_speed}</span></div>
                            <div> Humidity: <span>${info.humidity}</span></div>
                            </div>`
                        }).join('')
                    })
                }
                weatherData()
            })
        })
    })
}
fetchSearchedData()

clearBtn.addEventListener('click', () => {
    location.reload()
   
   localStorage.clear()
})

