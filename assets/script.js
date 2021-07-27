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
    
    const apiKey = "d2a2cad4f1d38ef0dfacee769aba90c6";
    
    console.log($searchByCity)
;            // populate page with weather data on submit
    $searchSubmitButton.click(function()  {
            const city = $searchByCity.val();
            console.log(city);
            getCity(city);
        })    
    
        // need a function here to display past searches
    
        function displayPastCities()    {
            const city = $('p');
    
            
            $pastCityList.append(city);
        }
        // utilize local storage
        // on load, display data from Boston or something
        // create elements to populate 5-day forecast items

        function getCity(city)  {

            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
            .then(function(response)    {
                return response.json();
            })
            .then(function(data)    {
                console.log(data);
            })
        }

});




