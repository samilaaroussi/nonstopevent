/**
 * Created by sami on 04/05/16.
 */
var map;
var places = {};
var reviews = {};
var placesService;
var categorie ={hotel:{google: "lodging",foursquare:"4bf58dd8d48988d1fa931735"},
                restaurant:{google:"restaurant",foursquare:"4d4b7105d754a06374d81259"},
                bar:{google:"bar",foursquare:"4bf58dd8d48988d116941735"},
                train_station:{google:"train_station",foursquare:"4bf58dd8d48988d129951735"},
                parking:{google:"parking",foursquare:"4c38df4de52ce0d596b336e1"},
                airport:{google:"airport",foursquare:"4bf58dd8d48988d1ed931735"},
            };

function addPlaces(type, radius) {

    /***************** Foursquare API *****************/

    var CLIENT_ID = '0JLT1NODQQWLG0C3G5MLPS4GFQKCAK5GBRUI5CQC2W2MX23Q';
    var CLIENT_SECRET = 'REEBOMIXJ0RAZO0D4UTBZXLBBSE5FGNHG05MUTF5P4B1MIXE';
    var descDiv = document.getElementById('desc');
    var LATLON = descDiv.getAttribute("latitude") + ','+descDiv.getAttribute("longitude"); //Position de l'évènement
    var venues = [];
    //var intend = 'browse';
        $.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ LATLON +'&categoryId=' + type +'&radius='+radius+ '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&limit=10&v=20140806',
            function (data) {
                venues = data.response.venues;
                for(var i=0; i<venues.length; i++)
                {
                    //console.log(venues[i].name);
                    //console.log(venues[i].id);
                    if(!places.hasOwnProperty("f" + venues[i].id))
                    {
                        places["f" + venues[i].id] = venues[i];
                        showPlace('f' + venues[i].id);
                    }
                }

            });

    console.log(places);
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
var descDiv = document.getElementById('desc');
descDiv.setAttribute('latitude',latitude);
descDiv.setAttribute('longitude',longitude);

//console.log(parseFloat(latitude) +' ' + parseFloat(longitude));
var myLatLng = new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));
map.setCenter(myLatLng);
map.setZoom(14);
        map.setOptions({ scrollwheel: false });
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
        });
 
}

function onSearchButton()
{
    //clean last search result
    cleanPlaces();
    
    var type = document.getElementById('type').value;
    var radius = 1000 * parseInt(document.getElementById('radius').value);
    
    search(categorie[type].google,radius);
    //search foursquare
    addPlaces(categorie[type].foursquare,radius);

}

function search(type, distance)
{
    var descDiv = document.getElementById('desc');
    parseFloat(descDiv.getAttribute("latitude"));
    parseFloat(descDiv.getAttribute("longitude"));
    var filter = {
        location:{
            lng:parseFloat(descDiv.getAttribute("longitude")),
            lat: parseFloat(descDiv.getAttribute("latitude"))
        },
        types: [type],
        radius: distance,
    };
    placesService = new google.maps.places.PlacesService(map);
    
    placesService.nearbySearch(filter,function(results,status)
    {
        if(status === google.maps.places.PlacesServiceStatus.OK)
        {
            for(var i=0; i<results.length;i++)
            {
                var placeId = 'g' + results[i].place_id;
                if(!places.hasOwnProperty(placeId))
                {
                    places[placeId] = results[i];
                    if(results[i].hasOwnProperty("photos"))
                    {
                         places[placeId].photo= results[i].photos[0].getUrl({maxHeight:256,maxWidth:256});
                    }
                    showPlace(placeId);
                }
            }

            
        }
    });
    
    
}

function showPlace(place_id)
{
    var results = document.getElementById("results");

        //variable place
        var place = places[place_id];
        
        var placeDiv = document.createElement("div");
        placeDiv.setAttribute("class","panel panel-primary");
        placeDiv.setAttribute("id", place_id);
        
        //place name
        var place_name_div = document.createElement("div");
        place_name_div.setAttribute("class","panel-heading");
        place_name_div.innerHTML = place.name;
        //place photo
        var place_photo = document.createElement("img");
        place_photo.setAttribute("src",place.photo);
        place_photo.setAttribute("class","img-thumbnail");
        //show reviews button
        var panel_body_div = document.createElement("div");
        panel_body_div.setAttribute("class","panel-body");
        var reviews_button =  document.createElement("button");
         reviews_button.setAttribute("onmouseover","getReviews('"  + place_id + "');");
        reviews_button.setAttribute("class","btn btn-info");
        reviews_button.setAttribute("data-toggle","collapse");
        reviews_button.setAttribute("data-target","#div"+place_id);
        reviews_button.innerHTML = "reviews";
        //staring(rating) div
        var rating_div = document.createElement('div');
        rating_div.setAttribute('class',"rateit");
        rating_div.setAttribute('data-rateit-value',2.5);
        rating_div.setAttribute('data-rateit-ispreset',"true");
        rating_div.setAttribute('data-rateit-readonly',"true");
        
        //review divs
        var reviews_div =  document.createElement("div");
        reviews_div.setAttribute("class","collapse in");
        reviews_div.setAttribute("id","div" + place_id);
        //append divs
        placeDiv.appendChild(place_name_div);
        panel_body_div.appendChild(place_photo);
        panel_body_div.appendChild(rating_div);
        panel_body_div.appendChild(reviews_button);
        panel_body_div.appendChild(reviews_div);
        placeDiv.appendChild(panel_body_div);
        
        results.appendChild(placeDiv);
        
        $('div.rateit, span.rateit').rateit(); 
}

function getReviews(place_id)
{
    switch(place_id[0])
    {
        case 'f':
                getFoursquareReviews(place_id.substring(1));
                break;
        case 'g':
            {
                getGoogleReviews(place_id.substring(1));
                break;
            }
        case 'h':
            
    }
}

var loading = false;

function getFoursquareReviews(place_id) {

    var CLIENT_ID = '0JLT1NODQQWLG0C3G5MLPS4GFQKCAK5GBRUI5CQC2W2MX23Q';
    var CLIENT_SECRET = 'REEBOMIXJ0RAZO0D4UTBZXLBBSE5FGNHG05MUTF5P4B1MIXE';
    var reviews_div = document.getElementById('div'+ 'f' + place_id);

    reviews_div.innerHTML = "<ul class='list-group'>";

    var token = '';

    $.getJSON('https://api.foursquare.com/v2/venues/' + place_id + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET,
        function (data) {
            place = data.response;
            console.log("foursquare:" + place);

        });

    reviews_div.innerHTML += "</ul>";
}


function getGoogleReviews(place_id)
{
    var reviews_for_a_place;

    if(!reviews.hasOwnProperty(place_id))
    {
        placesService.getDetails({placeId:place_id},function(result, status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                reviews_for_a_place = result.reviews;
                var reviews_div = document.getElementById('div'+ 'g' + place_id);
                reviews_div.innerHTML = "<ul class='list-group'>";
                for(var i=0; i< reviews_for_a_place.length; i++)
                {

                    reviews_div.innerHTML += '<li class="list-group-item"><blockquote>' + reviews_for_a_place[i].text ;
                    reviews_div.innerHTML += '<footer>' + reviews_for_a_place[i].author_name + '</footer>'+ '</blockquote></li>';
                }
                reviews_div.innerHTML += "</ul>";
            }
        });
    }
}
function cleanPlaces()
{
    places= {};
     var results = document.getElementById("results");
     results.innerHTML = "";
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    }