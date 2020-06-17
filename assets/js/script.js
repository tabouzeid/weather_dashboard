var apiKey = "5ef693924f14c302ac503a8b08523d52";
var url = "https://api.openweathermap.org/data/2.5/forecast?APPID="+apiKey;

$("#search-button").click(function(){
    var city = $("#search-value").val();

    $.ajax({
        "url": url+"&q="+city,
        "method": "GET"
    }).then(function(response){
        console.log(response);
        setCityInfo(response);
        setNextFiveDaysForecast(response);
    });
});
    
function setCityInfo(response) {
    $(".list-group").prepend($("<button>").addClass("list-group-item").text(response.city.name+", "+response.city.country));
    $("#today").empty().append($("<h1>").text(response.city.name + " ("+ response.list[0].dt_txt.slice(0, 10)+")"));
    var tmpF = (((parseFloat(response.list[0].main.temp) - 273.15) * (9/5)) + 32).toFixed(2);
    $("#today").append($("<p>").text("Temperature: " + tmpF + " °F"));
    $("#today").append($("<p>").text("Humidity: " + response.list[0].main.humidity + "%"));
    $("#today").append($("<p>").text("Wind Speed: " + (response.list[0].wind.speed) + " MPH"));
    // $("#today").append($("<p>").text("UV Index: " + response.list[0].main.humidity + "%"));
}

function setNextFiveDaysForecast(response){
    $("#forecastTitle").text("5-Day Forecast:");

    for(var i = 1; i <= 5; i++) {
        var dayWeather = response.list[(8*i)];
        if(dayWeather == undefined){
            dayWeather  = response.list[response.list.length-1];
        }
        var header = dayWeather.dt_txt.slice(0, 10);
        var card = $("#card"+i).empty();
        card.addClass("card text-white bg-primary mb-3").css("max-width: 18rem");
        var cardHeader = $("<div>").addClass("card-header").text(header);
        var cardBody = $("<div>").addClass("card-body");
        var cardBodyTitle = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+dayWeather.weather[0].icon+".png");
        var tmpF = (((parseFloat(dayWeather.main.temp) - 273.15) * (9/5)) + 32).toFixed(2);
        var cardBodyTemp = $("<p>").addClass("card-text").text("Temp: " + tmpF + " °F");
        var cardBodyHumidity = $("<p>").addClass("card-text").text("Humidity: " + dayWeather.main.humidity + "%");
        card.append(cardHeader);
        card.append(cardBody);
        cardBody.append(cardBodyTitle).append(cardBodyTemp).append(cardBodyHumidity);
    }
}