var searchInput = $(".weather-search");
var button = $("#search-button");
var todayWrapper = $("#today");
var forecastWrapper = $("#forecast");
var outputHistory = $("#history");
var forecastHeading = $(".forecast-heading");

var apiKey = "f172d5b5834c972027f76cfbaf70c231";

//var cityName = "London";

var baseURL = "https://api.openweathermap.org/data/2.5/";
var currentURL = baseURL + `weather?appid=${apiKey}&units=metric&`; //leaving out City name for the actual request
var forecastURL = baseURL + `forecast?appid=${apiKey}&units=metric&`; //won't put in lat and lon as they come from weather data
var iconURL = "https://openweathermap.org/img/w/"; //we can append our icon id to the end of this along with png and that should give us the image

// var date = moment();
// var timeDisplay = document.querySelector(".time-display");
// timeDisplay.innerText = date.format("DD/MM/YYYY");

//first request on input
function inputSubmitted(cityName) {
  //grab value from user's inner press or from a form submission
  // Prevent the default behavior
  cityName.preventDefault();
  var cityName = "";
  todayWrapper.innerHTML = " ";

  // if (!matches.length) {
  //   noMatch();
  // }
  // var keyCode = event.keyCode;
  cityName = searchInput.val().trim();
  console.log("search input", cityName);
  console.log(cityName);
  if (cityName) {
    $.get(currentURL + `q=${cityName}`) // no ampersand as we've done this already on
      .then(function (currentData) {
        console.log(currentData); //main is one of the object
        var date = moment.unix(currentData.dt).format("DD/MM/YYYY");
        todayWrapper.append(`
          <div class="today-card" style="color: #333;">
            <h2>${
              currentData.name
            } (${date}) <span><img src="${iconURL + currentData.weather[0].icon}.png"></span></h2>
            <p> Temp: ${Math.round(currentData.main.temp)}ºC</p>
            <p>Humidity: ${currentData.main.humidity}%</p>
            <p>Wind: ${currentData.wind.speed}m/s</p>
          </div>
    `);

        $.get(
          forecastURL +
            `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`
        ) //returns a promised object

          .then(function (forecastData) {
            console.log(forecastData);
            forecastHeading.append(`
                <row class="col-lg-12 pb-3"><div style="display:block"><h2>5 Day Forecast</h2>   </div>   </row>     
`);
            for (var castObj of forecastData.list) {
              forecastWrapper.append(`
                <div class="forecast-card"      style="background-color: #333;color: #fff;">
                      <h3>${castObj.dt}</h3>
                      <p><img src="${
                        iconURL + castObj.weather[0].icon
                      }.png"></p>
                      <p>Temp: ${Math.round(castObj.main.temp)}ºC</p>
                      <p>Humidity: ${castObj.main.humidity}%</p>
                      <p>Wind: ${castObj.wind.speed}m/s</p>   
                </div>
    `);
            }
          });
      });
  }
}

//inputSubmitted(city);

function init() {
  button.click(inputSubmitted);
}

init();
