var apiKey = "5ef693924f14c302ac503a8b08523d52";
var url = "https://api.openweathermap.org/data/2.5/forecast?APPID="+apiKey;
var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?APPID="+apiKey;

$("#search-button").click(function(){
    var city = $("#search-value").val();
    localStorage.setItem("lastCity", city);
    $.ajax({
        "url": url+"&q="+city,
        "method": "GET"
    }).then(function(response){
        $(".list-group").prepend($("<button>").addClass("list-group-item").text(response.city.name+", "+response.city.country));
        displayCityInfo(response);
    });
});

$(document).on("click", ".list-group-item", function(){
    var city = $(this).text();
    localStorage.setItem("lastCity", city);
    $.ajax({
        "url": url+"&q="+city,
        "method": "GET"
    }).then(function(response){
        displayCityInfo(response);
    });
});

function displayCityInfo(response){
    setTodaysInfo(response);
    setNextFiveDaysForecast(response);
}

function setTodaysInfo(response) {
    var today = $("#today");
    var forecast = response.list[0];
    
    today.empty().append($("<h1>").append(response.city.name + " ("+ forecast.dt_txt.slice(0, 10)+")").append($("<img>").attr("src", "http://openweathermap.org/img/wn/"+forecast.weather[0].icon+"@2x.png")));
    today.append($("<p>").text("Temperature: " + kelvinToFarenheit(forecast.main.temp) + " °F"));
    today.append($("<p>").text("Humidity: " + forecast.main.humidity + "%"));
    today.append($("<p>").text("Wind Speed: " + (forecast.wind.speed) + " MPH"));
    getUVIndex(response.city.coord.lat, response.city.coord.lon);
}

function setNextFiveDaysForecast(response){
    $("#forecastTitle").text("5-Day Forecast:");

    for(var i = 1; i <= 5; i++) {
        var dayWeather = response.list[(8*i)];
        if(dayWeather == undefined){
            dayWeather  = response.list[response.list.length-1];
        }
        addForecastCard(dayWeather, i);
    }
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
    $.ajax({
        "url": url+"&q="+lastCity,
        "method": "GET"
    }).then(function(response){
        displayCityInfo(response);
    });
}