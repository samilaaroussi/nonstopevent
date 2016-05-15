/**
 * Created by sami on 04/05/16.
 */
function show_alert()

{

    var oArgs = {

        app_key:"MBsKVhQWhpZSW9MP",

        id: "20218701",

        page_size: 25 ,

    };

    EVDB.API.call("/events/get", oArgs, function(oData) {

        // Note: this relies on the custom toString() methods below

    });

}

function eventpage()

{

    var oArgs = {

        app_key:"MBsKVhQWhpZSW9MP",

        id: "20218701",

        page_size: 25 ,

    };

    EVDB.API.call("/events/get", oArgs, function(oData) {

        // Note: this relies on the custom toString() methods below
        var id = oData.id;
        window.location = "event.html?id=" + id;

    });

}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function eventinfos()

{

    var url = document.URL;
    var id = url.substring(url.lastIndexOf('id=') + 1);

    var oArgs = {

        app_key:"MBsKVhQWhpZSW9MP",

        id: id,

        page_size: 25,

        image_sizes: "block100,block178,large,block250",

    };

    EVDB.API.call("/events/get", oArgs, function(oData) {

        // Note: this relies on the custom toString() methods below
        var eventTitle = oData.title;
        var eventCity = oData.city;
        var eventStart = new Date(oData.start_time);
        var eventEnd = new Date(oData.stop_time);

        $('#title').html("<h2>" + eventTitle + "<small> à " + eventCity +"</small></h2>" );
        $('.photos').html("<img src=" + oData.images.image[0].block178.url + "\/>");
        $('.location').html(oData.venue_name);
        $('.start').html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> Le " + eventStart.toLocaleDateString("fr-FR") + " à " + eventStart.getHours() + "h");

            var city = url.substring(url.lastIndexOf('l=') + 1);
    var req = $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=London&APPID=ae29dcbbd7d458f1d3ef66feb83120b7&units=metric');
    console.log(city);
    //usage:
    readTextFile("styles/weatherIcons/weatherIcons.json", function(text){

        var weatherIcons = JSON.parse(text);
        req.then(function(resp) {
            var prefix = 'wi wi-';
            var code = resp.weather[0].id;
            var icon = weatherIcons[code].icon;
            var deg = resp.main.temp;

            $('.deg').html(deg + "°");
            // If we are not in the ranges mentioned above, add a day/night prefix.
            if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                icon = 'day-' + icon;
            }

            // Finally tack on the prefix.
            icon = prefix + icon;
            var v = document.getElementById('weather');
            v.setAttribute("class",icon);
        });
    });


    });



}

function show_alert2()

{

    var oArgs = {

        app_key: "MBsKVhQWhpZSW9MP",

        q: "music",

        where: "San Diego",

        "date": "2013061000-2015062000",

        page_size: 5,

        sort_order: "popularity",

    };

    EVDB.API.call("/events/search", oArgs, function(oData) {

        // Note: this relies on the custom toString() methods below

    });

}
