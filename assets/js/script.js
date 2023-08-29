// Global variable declarations
var apiKey = '59a7f12740c8d248bd8602279058da5c';
var city = document.querySelector('#name-city');
var citySearch = document.querySelector('#search-btn');
var cityContainer = document.getElementById('response');
var forecastTitle = document.querySelector('.title');
var weatherContainer = document.getElementById('weatherReport');
var forecastItem = document.querySelector('.report-item');

// Fetch request to get city name from api
function getCity() {
	var cityName = city.value;
	var cityQuery =
		'https://api.openweathermap.org/geo/1.0/direct?q=' +
		cityName +
		'&limit=1&appid=' +
		apiKey;

	// Fetch request method
	fetch(cityQuery)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			// Dynamically creates button with searched city below search bar
			var recentSearch = document.createElement('button');
			recentSearch.textContent = cityName;
			cityStorageContainer(data[0]);
      cityContainer.appendChild(recentSearch);

			// Declares latitude and longitude variables for next api call
			let lat = data[0].lat;
			let lon = data[0].lon;

			// Calls location function and fetch request
			getLocation(lat, lon);
	
		});
}

// Fetch request to get precise location of city to draw weather patterns
function getLocation(lat, lon) {
	var locationQuery =
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		lat +
		'&lon=' +
		lon +
		'&appid=' +
		apiKey +
		'&units=imperial';

	// Fetch request method
	fetch(locationQuery)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			weatherContainer.innerHTML = '';

			// Today's weather
			let city = data.city.name;
			let forecastToday = data.list[0];
			let forecastTodayContainer = document.querySelector('.forecast-today');
			let weatherIcon = forecastToday.weather[0].icon;

			// Creates the weather icon image ex. sunny, rainy, cloudy, etc.
			let weatherImg = document.createElement('img');
			weatherImg.src = `https://openweathermap.org/img/w/${weatherIcon}.png`;

			let date = dayjs(forecastToday.dt_txt).day(0, 'day');
			let properFormatDate = date.format('MM-DD-YYYY');

			let weatherTodayHeader = document.createElement('div');
			weatherTodayHeader.innerHTML = 
				`<h3>${city} ` + `(${properFormatDate})` + `</h3>` +
				`<p>Temperature: ${forecastToday.main.temp}&#176; F</p>` +
				`<p>Humidity: ${forecastToday.main.humidity}%</p>` +
				`<p>Wind: ${forecastToday.wind.speed} Mph`;

				forecastTodayContainer.innerHTML = '';

				forecastTodayContainer.appendChild(weatherImg);
				forecastTodayContainer.appendChild(weatherTodayHeader);
				forecastTodayContainer.style.backgroundColor = 'honeydew';
				forecastTodayContainer.style.border = '2px solid black';

			// Iterates through data list, sets 5 day forecast
			for (let i = 1; i < 6; i++) {
				let forecast = data.list[i];
				let dailyDate = dayjs(forecast.dt_txt).day(i, 'day');
				let dailyDateFormat = dailyDate.format('MM-DD-YYYY');
				let dailyIcon = forecast.weather[0].icon;
	
				// Declare variables using dot notation
				let dailyWeatherImg = document.createElement('img');
				dailyWeatherImg.src = `https://openweathermap.org/img/w/${dailyIcon}.png`;
				let temp = forecast.main.temp; // Current temperature
				let wind = forecast.wind.speed; // Wind speed
				let humidity = forecast.main.humidity; // Humidity level

				var forecastContainer = document.createElement('div');
				forecastContainer.classList.add('forecast-week');
				forecastContainer.appendChild(dailyWeatherImg);

				// Prints results to page dynamically
				var locationSearch = document.createElement('li');
				forecastTitle.textContent = '5-Day Forecast: '
				locationSearch.innerHTML =
					`${dailyDateFormat}` +
					'<br>' +
					'<br>' +
					'Temp.: ' +
					temp +
					'\xB0 F' +
					'<br>' +
					'Humidity: ' +
					humidity +
					'%' +
					'<br>' +
					'Wind: ' +
					wind +
					' Mph';
				
				forecastContainer.appendChild(locationSearch);
				weatherContainer.appendChild(forecastContainer);
			}
		});
}

// Saves recent city searches to local storage
function cityStorageContainer(recent) {
	var refreshPage = JSON.parse(localStorage.getItem('cities')) || [];
	refreshPage.push(recent);
	localStorage.setItem('cities', JSON.stringify(refreshPage));
}

// Saves weather information to local storage
function weatherReportContainer(lat, lon) {
	var staticWeather = JSON.parse(localStorage.getItem('weather')) || [];
	staticWeather.push({ lat: lat, lon: lon });
	localStorage.setItem('weather', JSON.stringify(staticWeather));
}

// Pulls stored items from local storage and appends to viewport
function storedCities() {
	var cityList = JSON.parse(localStorage.getItem('cities')) || [];
	for (let i = 0; i < cityList.length; i++) {
		var recentSearch = document.createElement('button');
		recentSearch.textContent = cityList[i].name;
		cityContainer.appendChild(recentSearch);
	}
}

// Runs storedCities function after page loads
window.addEventListener('load', function () {
	storedCities();
});

// Event listener for submit button click, runs getCity()
citySearch.addEventListener('click', function (event) {
	event.preventDefault();
	getCity();
});

// cityContainer.addEventListener('click', function(event) {
// 	event.preventDefault();
// 	weatherContainer.innerHTML = '';
// 	getLocation();
// });


