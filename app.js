const apieKey = '8df524fcfcbbb5a966a64726ff3d0434'

// global variables 
const inputBar = document.querySelector('#input')
const inputValue = inputBar.value
console.log(inputValue)
const cityList = document.querySelector('.searched-cities')
const cardDiv = document.querySelector('.card-div')
const topInfo = document.querySelector('.top-info')
const searchBtn = document.querySelector('.search-btn')
const infoHead = document.querySelector('.info-head')
const temp = document.querySelector('.temp')
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')
const clearBtn = document.querySelector('.clear-btn')
const currentDay = dayjs().format('(M/DD/YYYY)')
let day = JSON.parse(dayjs().format('DD'))
let thisDay = dayjs().format('DD')

// array to hld the searched cities
let citiesArray = [];
//function to add searched cities to local storage

searchBtn.addEventListener('click' , () => {
    const item = inputBar.value
    fetchData(item)
    saveSearch(item)
})
function saveSearch (value) {
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
    
    fetchSearchedData()
    console.log(citiesArray)
    localStorage.setItem('cities', JSON.stringify(citiesArray))
}
//makes search history visible to user
function showSearches () {
    const newCitiesArray = JSON.parse(localStorage.getItem('cities'))
    if (newCitiesArray) {
        const citiesMap =  newCitiesArray.map(info => {
            return `<li><button class="searched-city-btn">${info}</button></li>`
            
            }).join("")
            console.log(citiesMap)
            cityList.innerHTML = citiesMap
    } else {
        cityList.innerHTML = "No cities searched."
    }
}
showSearches()
// functionto fetch weather datat from api
function fetchData (item) {
    const urlForCity = `https://api.openweathermap.org/geo/1.0/direct?q=${item}&limit=1&appid=${apieKey}`
    fetch(urlForCity).then(res => res.json()).then(data => {
        console.log(data)
        let lat = data[0].lat
        let long = data[0].lon
        let name= data[0].name
        console.log("lat " + lat, "lon " + long)
        // fetch function for weather data 
       weatherData(lat, long, name)
    })
}

function weatherData (lat, long, name) {
    const urlForLatLong = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=imperial&cnt=5&exclude=alerts&appid=${apieKey}`
    fetch(urlForLatLong).then(res => res.json()).then(weather => {
        console.log(weather)
        infoHead.innerHTML = name + " " + currentDay + " " + `<img src=https://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png></img>`
        temp.innerHTML = " " + weather.current.temp + "ºF"
        wind.innerHTML = " " + weather.current.wind_speed + " MPH"
        humidity.innerHTML = " " + weather.current.humidity + " %"
        
       cardDiv.innerHTML = weather.daily.splice(1, 5).map( info => {
        //converts UTC time to local time.
            const timestamp = info.dt
            const date = new Date(timestamp * 1000)
            return `<div class="card">
                <h3>${date.toLocaleString("en-US").slice(0, 9)}</h3>
                <img src="https://openweathermap.org/img/wn/${info.weather[0].icon}.png"></img>
                <div> Temp: <span>${info.temp.day}ºF</span></div>
                <div> Wind: <span>${info.wind_speed}MPH</span></div>
                <div> Humidity: <span>${info.humidity}%</span></div>
            </div>`
        }).join('')
    })
}

// fetches weather data for searched items. press searched item to trigger
function fetchSearchedData () {
   
    const searchedBtn = document.querySelectorAll('.searched-city-btn')
     console.log(searchedBtn)
    searchedBtn.forEach(each => {
        const buttonItem = each.textContent
        console.log(buttonItem)
        each.addEventListener('click', () => {fetchData(buttonItem)})
    })
}
fetchSearchedData()

clearBtn.addEventListener('click', () => {
    location.reload()
   
   localStorage.clear()
})

