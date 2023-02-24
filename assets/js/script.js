// var searchInput = $(".weather-search");
var searchInput = $(".form-input");
var searchButton = $("#search-button");
//jmbtrn = display-artist is today
var todayWrapper = $("#today");

//dspCrds = dsp songsdisplay forecast//forecast is songs/
var forecastWrapper = $("#forecast");

var forecastHeading = $(".forecast-heading");
var localStorageArray = [];

var searchHistorySection = $("#search-history");
// var outputHistory = $("#history");

var clearButton = $("#clear-button");

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
  // var cityName = "";
  //jumbtrn
  todayWrapper.html("");

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
        //jmbtrn
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
        addToSearchHistory(cityName);
        console.log("add to search", cityName);
        $.get(
          forecastURL +
            `lat=${currentData.coord.lat}&lon=${currentData.coord.lon}`
        ) //returns a promised object

          .then(function (forecastData) {
            console.log(forecastData);

            // Clear the forecastWrapper element
            forecastWrapper.html("");
            forecastHeading.append(`
              <row class="col-lg-12 pb-3">
                <div style="display:block">
                  <h2>${cityName} 5 Day Forecast</h2>  
                </div>  
               </row>     
          `);
            for (var castObj of forecastData.list) {
              forecastWrapper.append(`
                <div class="forecast-card" style="background-color: #333;color: #fff;">
                <h3>${moment.unix(castObj.dt).format("DD/MM/YYYY")}</h3>    
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
// Adding the option to clear search history
function clearPreviousSearch() {
  localStorage.removeItem("cityName");
  searchHistorySection.empty();
}

function addToSearchHistory(cityName) {
  var searchHistory = searchInput.val().toLowerCase().trim(); // Getting the searched city from the search input
  console.log("cityName-addtosearchhistory", cityName);
  if (searchHistory == "") {
    return;
  }

  //If search input is already in the array, don't add again
  //Without this we get duplicate results
  if (localStorageArray.indexOf(searchHistory) > -1) {
    return;
  }
  console.log("check if adding cityName", searchHistory);
  // Checking to see if the searched artist is already stored in localStorage
  // Object {Key: artist, Value: search input string}
  if (localStorage.getItem("cityName") == null) {
    localStorageArray.push(searchHistory); //pushing searched term into the array
  } else {
    localStorageArray = JSON.parse(localStorage.getItem("cityName"));

    //Checking if keyword doesn't already exist in array, if not then pushing it through
    if (localStorageArray.indexOf(searchHistory) === -1) {
      localStorageArray.push(searchHistory);
    }
  }

  //Adding the searched term as a button in search history
  searchHistorySection.append(`
    <button data-city="${cityName}" type="button" class="city-history btn btn-dark btn-block">${cityName}</button>
    `);

  //Stringifying searched terms array into a string
  localStorage.setItem("cityName", JSON.stringify(localStorageArray));
}
//inputSubmitted(city);
function getPreviouslySearchedTermsFromLocalStorage() {
  //If statement to check whether array already exists in localStorage, if it does, then parse it back into an array
  if (localStorage.getItem("cityName") != null) {
    localStorageArray = JSON.parse(localStorage.getItem("cityName"));

    //Using a for loop to add all previous searched terms as buttons
    for (var i = 0; i < localStorageArray.length; i++) {
      var location = localStorageArray[i];

      searchHistorySection.append(`
                <button data-artist="${location}" type="button" class="artist-history btn btn-dark btn-block">${location}</button>
            `);
    }
  }
}

//Creating click event for all search history buttons inside #history div
function recallCity() {
  //repopulating searchInput using data-location attribute
  var text = $(this).text();
  //Removing and adding classes to change the highlighted button colours when selected
  $(".city-history").removeClass("btn-info").addClass("btn-dark");
  $(this).removeClass("btn-dark").addClass("btn-info");
  inputSubmitted(text);
}

function init() {
  searchButton.click(inputSubmitted);
  //   searchInput.keydown(inputSubmitted);
  searchHistorySection.on("click", ".city-history", recallCity);
  clearButton.click(clearPreviousSearch);
  getPreviouslySearchedTermsFromLocalStorage();
}

init();
