/**
 * Created by sami on 04/05/16.
 */
var map;

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
        var eventCountry = oData.country;
        var eventStart = new Date(oData.start_time);
        var eventEnd = new Date(oData.stop_time);
        var lat = oData.latitude;
        var long = oData.longitude;
        var eventTags = oData.tags;
        var eventTagss = [];
        var i = 0;
        var longitude = oData.longitude;
        var latitude = oData.latitude;
        while(eventTags.tag[i]) {
            eventTagss.push(eventTags.tag[i].id);
            i = i+1;
        }
        console.log(eventTagss);

        $('#title').html("<h2>" + eventTitle + "</h2>" );
        $('.photos').html("<img src=" + oData.images.image[0].block178.url + "\/>");
        $('.location').html(oData.venue_name);
        $('.start').html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> Le " + eventStart.toLocaleDateString("fr-FR") + " à " + eventStart.getHours() + "h");

    var req = $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + eventCity + '&APPID=ae29dcbbd7d458f1d3ef66feb83120b7&units=metric');
    //usage:
    readTextFile("styles/weatherIcons/weatherIcons.json", function(text){

        var weatherIcons = JSON.parse(text);
        req.then(function(resp) {
            var prefix = 'wi wi-';
            var code = resp.weather[0].id;
            var icon = weatherIcons[code].icon;
            var deg = resp.main.temp;

            $('.deg').html(deg + "°");
            $('.degDesc').html(eventCity + ", " + eventCountry);

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

//localisation google map
var myLatLng = {lng: parseFloat(longitude),
                    lat: parseFloat(latitude)};
   
map.setCenter(myLatLng);
map.setZoom(14);
 var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
  });
    


        var reqfb = $.getJSON('https://api.instagram.com/v1/locations/search?lat=' + lat + '&lng=' + long + '&access_token=523407829.1677ed0.e4b8167878444ab79936d95eb6112d3e');

        /*console.log(reqfb);

        var res = reqfb.id[0];
        console.log(reqfb);*/

        var feed = new Instafeed({
            get: 'location',
            locationId: 273471170716,
            clientId: 'b7699de0ea314370aeb5466a86505c85',
            accessToken: '523407829.1677ed0.e4b8167878444ab79936d95eb6112d3e',
            target: 'insta',
            resolution: 'low_resolution',
            limit: 24,
            template: '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 nopadding"><a href="{{link}}" target="_blank"><img src="{{image}}" class="img-responsive" /></a></div>'
        });
        feed.run();

/*        function getMultipleTags(tags) {
            var feeds = [];
            for (var i = 0, len = tags.length; i < len; i++) {
                feeds.push(new Instafeed({
                    // rest of your options
                    get: 'tagged',
                    tagName: tags[i],
                    clientId: 'b7699de0ea314370aeb5466a86505c85',
                    accessToken: '523407829.1677ed0.e4b8167878444ab79936d95eb6112d3e',
                    target: 'insta',
                    resolution: 'low_resolution',
                    limit: 4,
                    template: '<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 nopadding"><a href="{{link}}" target="_blank"><img src="{{image}}" class="img-responsive" /></a></div>'
                }));
            }
            return feeds;
        }
// get multiple tags
        myTags = getMultipleTags(eventTagss);

        console.log(eventTagss);
// run each instance
        for(var i=0, len=myTags.length; i < len; i++) {
            console.log(myTags[i]);
            myTags[i].run();
        }*/
    });

}



function init() {
  //get parametre l in url
   
        map = new google.maps.Map(document.getElementById('map'), {
        center: 'Lyon, France',
        zoom: 10
        });
 
}




function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    }