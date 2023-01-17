/* 
  When Page Loads:

  1. Show user an input to allow them to search for a city
    - show a message on the page to point them, or guide them, to the input.
    //Pls use the input to search for a city to show forecast and current conditions
    - Once city has been inputted:
      a. Show Current Forecast
      b. Show 5 day Forecast
      c. Add city name to search history
        - Get previous searches from localStorage
        - If inputted city has not been stored to search history in localStorage,add or push the city name
        - Set the search history to localStorage
  2. Show search history
    - Pull search history from localStorage
    - If search history is not empty, output each city to the search history display in the DOM
    https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    f172d5b5834c972027f76cfbaf70c231
*/
var searchInput = $(".weather-search");
var todayWrapper = $("#today");
var forecastWrapper = $("#forecast");

var apiKey = "f172d5b5834c972027f76cfbaf70c231";
var city = "London";
var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`; //leaving out City name for the actual request. & suffix so that we dont need to put it in when a request is made.
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`; //won't put in lat and lon as they come from weather data so cannot be put into bsse url. lat=${lat}&lon=${lon}
//We have our 2 base urls to begin our requestAnimationFrame.
var iconURL = "https://openweathermap.org/img/w/"; //we can append our icon id to the end of this along with png and that should give us the image

//first request on input
function inputSubmitted(cityName) {
  //grab value from user's inner press or from a form submission
  $.get(currentURL + `q=${cityName}`) // no ampersand as we've done this already on 25//this returns a promised object which gives .then method//to pull data from promised we need to use the then method and pass in a callback
    .then(function (currentData) {
      //this will not be called until previous statement responds and correspondingly the code inside
      //the data will be passed through our callback
      console.log(currentData); //main is one of the object we will use because it has props we are interested in. temp,humidity, wind;speed prop
      console.log(`
    _______Current Conditions_________
    Name:${currentData.name}
    Temp:${Math.round(currentData.main.temp)}ºC
    Humidity:${currentData.main.humidity}%
    Wind:${currentData.wind.speed}m/s
    IconURL:${iconURL + currentData.weather[0].icon}.png
    `); //works on both current and forecast data
      // var lat = "currentData.coord.lat";
      // var lon = "currentData.coord.lon";
      // $.get(forecastURL + `lat=${lat}&lon=${lon}`); //returns a promised object
      $.get(
        forecastURL +
          `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`
      ) //returns a promised object
        //forecast request needs to be done from within codeblock for .then callback
        .then(function (forecastData) {
          console.log(forecastData); //this shows last//this shows array list which needs to be looped over and data extracted.such as temp and we could use wind speed too.
          for (var castObj of forecastData.list) {
            console.log(`
            _______Weather Forecast_________
    
    Temp:${Math.round(castObj.main.temp)}ºC
    Humidity:${castObj.main.humidity}%
    Wind:${castObj.wind.speed}m/s
    IconURL:${iconURL + castObj.weather[0].icon}.png
            
            `);
          }
        });
    });
}
//we need lon and lat in order to make our forecast api work
inputSubmitted(city); //we still need q parameter
