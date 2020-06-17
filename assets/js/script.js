var apiKey = "5ef693924f14c302ac503a8b08523d52";
var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?APPID="+apiKey; 
var fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?APPID="+apiKey;
var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?APPID="+apiKey;

$("#search-button").click(function(){
    var city = $("#search-value").val();
    localStorage.setItem("lastCity", city);
    $(".list-group").prepend($("<button>").addClass("list-group-item").text(city));
    displayCityInfo(city);
});

$(document).on("click", ".list-group-item", function(){
    var city = $(this).text();
    localStorage.setItem("lastCity", city);
    displayCityInfo(city);
});

function displayCityInfo(city){
    setTodaysInfo(city);
    setNextFiveDaysForecast(city);
}

function setTodaysInfo(city) {
    $.ajax({
        "url": currentWeatherUrl+"&q="+city,
        "method": "GET"
    }).then(function(response){
        var today = $("#today");
        
        today.empty().append($("<h1>").append(response.name + " (" + moment().format("MM/DD/yyyy") + ")").append($("<img>").attr("src", "http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png")));
        today.append($("<p>").text("Temperature: " + kelvinToFarenheit(response.main.temp) + " °F"));
        today.append($("<p>").text("Humidity: " + response.main.humidity + "%"));
        today.append($("<p>").text("Wind Speed: " + (response.wind.speed) + " MPH"));
        getUVIndex(response.coord.lat, response.coord.lon);
    });
}

function setNextFiveDaysForecast(city){
    $("#forecastTitle").text("5-Day Forecast:");
    $.ajax({
        "url": fiveDayForecastUrl+"&q="+city,
        "method": "GET"
    }).then(function(response){
        var num = 1;
        for(var i = 4; i < response.list.length; i+=8) {
            var dayWeather = response.list[i];
            addForecastCard(dayWeather, num++);
        }
    });
}

function getUVIndex(lat, lon){
    $.ajax({
        "url": uvUrl+"&lat="+lat+"&lon="+lon,
        "method": "GET"
    }).then(function(response){
        var uvIndex = parseFloat(response.value).toFixed(2);
        var color = "green";
        if(uvIndex <= 2){
            color = "green";
        } else if (uvIndex <= 7){
            color = "yellow";
        } else {
            color = "red";
        }
        var p = $("<p>");
        var span = $("<span>");
        span.css("background-color", color);
        span.css("padding", "5px");
        span.text(uvIndex);
        p.append("UV Index: ").append(span);
        $("#today").append(p);
    });
}

function addForecastCard(dayWeather, cardNum){
    var header = dayWeather.dt_txt.slice(0, 10);
    var card = $("#card"+cardNum).empty();
    card.addClass("card text-white bg-primary mb-3").css("max-width: 18rem");
    var cardHeader = $("<div>").addClass("card-header").text(header);
    var cardBody = $("<div>").addClass("card-body");
    var cardBodyTitle = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+dayWeather.weather[0].icon+".png");
    var tmpF = kelvinToFarenheit(dayWeather.main.temp);
    var cardBodyTemp = $("<p>").addClass("card-text").text("Temp: " + tmpF + " °F");
    var cardBodyHumidity = $("<p>").addClass("card-text").text("Humidity: " + dayWeather.main.humidity + "%");
    card.append(cardHeader);
    card.append(cardBody);
    cardBody.append(cardBodyTitle).append(cardBodyTemp).append(cardBodyHumidity);
}

function kelvinToFarenheit(kelvin){
    return (((parseFloat(kelvin) - 273.15) * (9/5)) + 32).toFixed(2);
}

var lastCity = localStorage.getItem("lastCity");
if(lastCity != undefined){
    displayCityInfo(lastCity);
}