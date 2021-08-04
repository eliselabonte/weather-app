$(document).ready(function () {
    const $searchByCity = $('#searchByCity');
    const $searchSubmitButton = $('#searchSubmit');
    const $pastCityList = $('#pastCityList');
    const $todayDate = $('#todayDate');
    const $cityName = $('#cityName');
    const $weatherDescription = $('#weatherDescription');
    const $temperature = $('#temperature');
    const $humidity = $('#humidity');
    const $windspeed = $('#windspeed');
    const $uvIndex = $('#uvIndex');
    const $dayOneWeather = $('#dayOne');
    const $dayTwoWeather = $('#dayTwo');
    const $dayThreeWeather = $('#dayThree');
    const $dayFourWeather = $('#dayFour');
    const $dayFiveWeather = $('#dayFive');
    let storedCity = getStorage('pastCities');
    let parsedCitiesFromStorage = parseThis(storedCity)

    let currentDay = dayjs();
    // dayjs.extend(window.dayjs_plugin_utc);
    
    const apiKey = "d2a2cad4f1d38ef0dfacee769aba90c6";
    
    // functions for accessing local storage
    function parseThis(thing)   {
        return JSON.parse(thing);
    };
    
    function stringifyThis(thing)   {
        return JSON.stringify(thing);
    };
    
    function getStorage(item)   {
        return localStorage.getItem(item);
    };
    
    function setStorage(key, value)    {
        return localStorage.setItem(key, value)
    };
    
    function getWeather(lat, long)  {
        console.log(lat, long)

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lat}&exclude={part}&appid=${apiKey}&units=imperial`)
        .then(function(response)    {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const currentWeather = data.current;
            const forecast = data.daily;
            displayCurrentWeather(currentWeather);
            displayForecast(forecast);
        })
    }

    function getCity(city)  {

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}&units={metric}`)
        .then(function(response)    {
            return response.json();
        })
        .then(function(data)    {
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            console.log(data)

            getWeather(latitude, longitude)
        })
    }

    function displayDate()   {
        currentDay = dayjs();
        const day = currentDay.format('dddd MMMM DD, YYYY');

        $todayDate.text(day);
    }

    // show previously searched cities in the past city list
    function displayPastCities(city, i)    {
        if (i<4)    {
            const newCity = $('<li>').addClass('past-city-list-item');
            newCity.text(city);
            $pastCityList.append(newCity);
        }
    };


    // populate page with weather data on submit
    $searchSubmitButton.click(function()  {
            const city = $searchByCity.val();
            const stringifiedCity = stringifyThis(city);

            $cityName.text(city);
            
            // cities from storage is the storage item 'pastCities'
            const citiesFromStorage = localStorage.getItem('pastCities');
            
            if (city)   {
                
                getCity(city)

                if (!citiesFromStorage) {
                    setStorage('pastCities', `[${stringifiedCity}]`);
                }

                else {
                    // parse those items from localStorage
                    storedCity = getStorage('pastCities');
                    parsedCitiesFromStorage = parseThis(storedCity);

                    // add the entered city to the list
                    const newParsedList = [city, ...parsedCitiesFromStorage];
                    const newStringifiedList = stringifyThis(newParsedList);

                    setStorage('pastCities', newStringifiedList);

                    parsedCitiesFromStorage.forEach(displayPastCities);
                }
            }
            else    {
                window.alert('Please enter a city.')
            }
    });    

    function displayCurrentWeather(allWeather)   {
        const weather = allWeather.weather[0].description;
        const temp = (allWeather.temp).toFixed(0);
        const humidity = allWeather.humidity;
        const windspeed = allWeather.wind_speed;
        const uvIndex = allWeather.uvi;

        $weatherDescription.text(weather.toUpperCase());
        $temperature.text(temp + "°C");
        $humidity.text("Humidity: " + humidity + "%");
        $windspeed.text("Windspeed: " + windspeed + "kmph");
        $uvIndex.text("UVI: " + uvIndex);

        if (uvIndex === 0)  {
            $uvIndex.text("no UVI data");
        }
        else if (uvIndex < 4)   {
            $uvIndex.removeClass("moderate")
            $uvIndex.removeClass("severe")
            $uvIndex.addClass("favorable")
        }
        else if (uvIndex < 8)   {
            $uvIndex.removeClass("favorable")
            $uvIndex.removeClass("severe")
            $uvIndex.addClass("moderate")
        }
        else    {
            $uvIndex.removeClass("favorable")
            $uvIndex.removeClass("moderate")
            $uvIndex.addClass("severe")
        } 
    }

    function displayForecast(allForecastData)  {

        $dayOneWeather.html('');

        const dayOne = allForecastData[0];
        const dayOneUnformatted = currentDay.add(1, 'd').format('MM DD, YYYY');
        console.log(dayOneUnformatted);
        const dayTwo = allForecastData[1];
        const dayThree = allForecastData[2];
        const dayFour = allForecastData[3];
        const dayFive = allForecastData[4];

        // const dayTwoDate = dateFormat(currentDay + 2);
        // const dayThreeDate = dateFormat(currentDay + 3);
        // const dayFourDate = dateFormat(currentDay + 4);
        // const dayFiveDate = dateFormat(currentDay + 5);

        // const dayOneFormatted = dayOneUnformatted.format('MMMM DD, YYYY');  



        // dayOne display
        let fcweather = dayOne.weather[0].description;
        let fctemp = (dayOne.temp.day);
        // .toFixed(0)

        // const $dayOneDateDisplay = $("<h3>").text(dayOneDate);.append($dayOneDateDisplay)
        const $dayOneWeatherDisplay = $("<p>").text(fcweather);
        const $dayOneTempDisplay = $("<p>").text(fctemp.day);

        $dayOneWeather.append($dayOneWeatherDisplay).append($dayOneTempDisplay);

        // dayTwo display
        fcweather = dayTwo.weather[0].description;
        fctemp = (dayTwo.temp.day);
        const $dayTwoWeatherDisplay = $("<p>").text(fcweather);
        const $dayTwoTempDisplay = $("<p>").text(fctemp.day);

        $dayTwoWeather.append($dayTwoWeatherDisplay).append($dayTwoTempDisplay);

        // dayThree display
        fcweather = dayThree.weather[0].description;
        fctemp = (dayThree.temp.day);
        const $dayThreeWeatherDisplay = $("<p>").text(fcweather);
        const $dayThreeTempDisplay = $("<p>").text(fctemp.day);

        $dayThreeWeather.append($dayThreeWeatherDisplay).append($dayThreeTempDisplay);

        // dayFour display
        fcweather = dayFour.weather[0].description;
        fctemp = (dayFour.temp.day);
        const $dayFourWeatherDisplay = $("<p>").text(fcweather);
        const $dayFourTempDisplay = $("<p>").text(fctemp.day);

        $dayFourWeather.append($dayFourWeatherDisplay).append($dayFourTempDisplay);

        // dayFive display
        fcweather = dayFive.weather[0].description;
        fctemp = (dayFive.temp.day);
        const $dayFiveWeatherDisplay = $("<p>").text(fcweather);
        const $dayFiveTempDisplay = $("<p>").text(fctemp.day);

        $dayFiveWeather.append($dayFiveWeatherDisplay).append($dayFiveTempDisplay);
        

    }

    function displayMostRecentSearchOnLoad()    {
        const mostRecentSearchedCity = parsedCitiesFromStorage[0];
        getCity(mostRecentSearchedCity);
    }

    $pastCityList.click(function(e)  {
        const thingClicked = e.target;
        console.log(thingClicked.innerText)

        if  (thingClicked.matches('li'))    {
            const pastCitySelected = thingClicked.innerText;
            getCity(pastCitySelected);
        }
    })

    displayDate();

    // this function works, but don't turn it on until deploy (limit api pulls)
    displayMostRecentSearchOnLoad()

    parsedCitiesFromStorage.forEach(displayPastCities);

    

});




