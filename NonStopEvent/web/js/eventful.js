/**
 * Created by sami on 04/05/16.
 */
var map;
var places = {};
var reviews = {};
var placesService;
var categorie ={hotel:{google: "lodging",foursquare:"4bf58dd8d48988d1fa931735",here:"hotel"},
                restaurant:{google:"restaurant",foursquare:"4d4b7105d754a06374d81259",here:"restaurant"},
                bar:{google:"bar",foursquare:"4bf58dd8d48988d116941735",here:"coffee-tea"},
                train_station:{google:"train_station",foursquare:"4bf58dd8d48988d129951735"},
                parking:{google:"parking",foursquare:"4c38df4de52ce0d596b336e1"},
                airport:{google:"airport",foursquare:"4bf58dd8d48988d1ed931735",here:"airport"},
            };
var here;
var venue;
function addPlaces(type, radius) {

    /***************** Foursquare API *****************/

    var CLIENT_ID = '0JLT1NODQQWLG0C3G5MLPS4GFQKCAK5GBRUI5CQC2W2MX23Q';
    var CLIENT_SECRET = 'REEBOMIXJ0RAZO0D4UTBZXLBBSE5FGNHG05MUTF5P4B1MIXE';
    var descDiv = document.getElementById('desc');
    var LATLON = descDiv.getAttribute("latitude") + ','+descDiv.getAttribute("longitude"); //Position de l'évènement
    var venues = [];
    var details = [];
    var rating = 0;
    var ratingColor = '';
    var photo = [];
    //var intend = 'browse';
        $.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ LATLON + '&categoryId=' + type +'&radius='+radius+ '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&limit=20&v=20140806',
            function (data) {
                venues = data.response.venues;
                for(var i=0; i<venues.length; i++)
                {
                    //console.log(venues[i].name);
                    //console.log(venues[i].id);

                    if(!places.hasOwnProperty("f" + venues[i].id))
                    {
                        places["f" + venues[i].id] = venues[i];

                    }
                    venue = venues[i];

                    $.getJSON('https://api.foursquare.com/v2/venues/' + venue.id + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160528',
                        function (data) {
                            if(!data.response.venue.hasOwnProperty('rating') &&
                                !data.response.venue.hasOwnProperty('bestPhoto')){
                                delete places["f" + data.response.venue.id];
                                return;
                            }
                            
                            if(data.response.venue.hasOwnProperty('rating')) {
                  
                                rating = data.response.venue.rating;
                                places["f" + data.response.venue.id].rating = rating/2;
                                
                                
                                ratingColor = ratingBg(rating);
                                places["f" + data.response.venue.id].ratingColor = ratingColor;

                                //console.log(rating/2);
                            }else
                            {
                                places["f" + data.response.venue.id].rating = -1;
                                places["f" + data.response.venue.id].ratingColor = ratingBg(0);
                            }

                            if(data.response.venue.hasOwnProperty('bestPhoto')) {
                                photo = data.response.venue.bestPhoto.prefix + "256x256" + data.response.venue.bestPhoto.suffix;
                                //photo = data.response.venue.photos.groups[0].items[0].prefix + "256x256" + data.response.venue.photos.groups[0].items[0].suffix;
                                places["f" + data.response.venue.id].photo = photo;
                                //console.log(photo);
                            }
                            //phone number
                            if(data.response.venue.hasOwnProperty('contact'))
                            {
                                if(data.response.venue.contact.hasOwnProperty('formattedPhone'))
                                {
                                    places["f" + data.response.venue.id].international_phone_number = data.response.venue.contact.formattedPhone;
                                }
                            }
                            showPlace("f" + data.response.venue.id);
                        }
                    );
                }

            });

    //console.log(places);
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

        image_sizes: "block,block150,block178,large,block250",

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
        //console.log(eventTagss);

        $('#title').html("<h2>" + eventTitle + "</h2>" );
        $('.photos').html("<img class=\"img-rounded\" src=" + oData.images.image[0].block.url + "\/>");
        $('.location').html(oData.venue_name);
        $('.start').html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> Le " + eventStart.toLocaleDateString("fr-FR") + " à " + eventStart.getHours() + "h");
        $('#blurBg').backgroundBlur({
            imageURL : oData.images.image[0].large.url,
            blurAmount : 50,
            imageClass : 'bg-blur'

        });
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
    });

}



function init() {
  //get parametre l in url

        map = new google.maps.Map(document.getElementById('map'), {
        });
        initHere();

}

function onSearchButton()
{
    //clean last search result
    cleanPlaces();
    $('#googlemap').removeClass('col-md-12');
    $('#googlemap').addClass('col-md-6');
    $('#googlemap').css( "position", "fixed" );
    var type = document.getElementById('type').value;
    var radius = 1000 * parseInt(document.getElementById('radius').value);

    search(categorie[type].google,radius);
    //search foursquare
    addPlaces(categorie[type].foursquare,radius);
    //searchHerePlaces(categorie[type].here,radius);

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
        radius: distance
    };
    placesService = new google.maps.places.PlacesService(map);


    placesService.radarSearch(filter,function(results,status)
    {
        if(status === google.maps.places.PlacesServiceStatus.OK)
        {
            var count_g = 0;
            for(var i=0; i<results.length;i++)
            {
                //filter.next_page_token = next_page_token;
                var placeId = 'g' + results[i].place_id;

                if(!places.hasOwnProperty(placeId))
                {
                    //place id
                    places[placeId] = results[i];
                    //get place detail
                    setTimeout(function(param){    
                    placesService.getDetails(param,function(result, stat){
                        
                        if(stat === google.maps.places.PlacesServiceStatus.OK)
                        {   //place id
                            var placeId = 'g' + result.place_id;
                            //place name
                            places[placeId].name = result.name;
                            //phone number
                             if(result.hasOwnProperty('international_phone_number'))
                             {
                                places[placeId].international_phone_number = result.international_phone_number;   
                              }
                              //photos
                    if(result.hasOwnProperty("photos"))
                    {
                         places[placeId].photo= result.photos[0].getUrl({maxHeight:256,maxWidth:256});
                         places[placeId].photos = result.photo;
                         
                    }
                    //rating
                    if(result.hasOwnProperty('rating'))
                    {
                                places[placeId].rating = result.rating;  
                                places[placeId].ratingColor = ratingBg(result.rating);
                    }else
                    {
                                 places[placeId].rating = -1;  
                                 places[placeId].ratingColor = ratingBg(-1);
                    }
                     //reviews        
                     if(result.hasOwnProperty('reviews'))
                     {
                        reviews[placeId] = result.reviews;
                     }
                    showPlace('g' + result.place_id);
                        }else
                        {
                            console.log("get place detail exception status: "+ status);
                            clearTimeout();
                        }
                        
                    }); // get place detail
                },500*count_g++,{placeId:results[i].place_id});
                    
                }
            }
            
        }else
        {
            console.log("google rader search exception");
        }
        
    });//google radar search
   
}

function searchHerePlaces(type, distance)
{
    var descDiv = document.getElementById('desc');

    var explore = new H.places.Explore(here.getPlacesService()), exploreResult;

    // Define search parameters:
    var params = {
    // Plain text search for places with the word "hotel"
    // associated with them:
      cat: type,
    //  Search in the Chinatown district in San Francisco:
      'at': descDiv.getAttribute("latitude") + ',' + descDiv.getAttribute("longitude")
    };

    explore.request(params, {},
    function(data) {

        for(var i =0; i<data.results.items.length;i++)
        {
            var place = {};
            place.name = data.results.items[i].title;
            place.rating = data.results.items[i].averageRating;
            place.id = 'h' + data.results.items[i].id;
            place.distance = data.results.items[i].distance;
            places[place.id] = place;
            ratingColor = ratingBg(averageRating);
            places["h" + place.id].ratingColor = ratingColor;
            showPlace(place.id);
        }
    },
    function(data) {//console.log(data);
});

}
function showPlace(place_id)
{
    var results = document.getElementById("results");

        //variable place
        var place = places[place_id];

        var placeDiv = document.createElement("div");
        placeDiv.setAttribute("class","col-md-12");
        placeDiv.setAttribute("id", place_id);

        //place div well
        var placeDivWell = document.createElement("div");
        placeDivWell.setAttribute("class","well well-sm");

        var placeDivRow = document.createElement("div");
        placeDivRow.setAttribute("class","row");

        var placeDivCol3 = document.createElement("div");
        placeDivCol3.setAttribute("class","col-xs-3 col-md-3 text-center");

        var placeDivCol9 = document.createElement("div");
        placeDivCol9.setAttribute("class","col-xs-9 col-md-9 section-box");

        var placeDivCol12 = document.createElement("div");
        placeDivCol12.setAttribute("class","col-md-12");

        //place name
        var place_name_div = document.createElement("h3");
        place_name_div.innerHTML = place.name;

        var place_desc = document.createElement("p");
        place_desc.innerHTML = '<hr>';

        var place_rating = document.createElement("div");
        place_rating.setAttribute("class","row rating-desc");

        var span_separator = document.createElement("span");
        span_separator.setAttribute("class","separator");

        var span_separator2 = document.createElement("span");
        span_separator2.setAttribute("class","separator");


        //place photo
        var place_photo = document.createElement("img");
        if(!place.hasOwnProperty('photo'))
        {
            place.photo = 'images/imageNotFound.jpg';
        }
        place_photo.setAttribute("src",place.photo);
        place_photo.setAttribute("height",128);
        place_photo.setAttribute("width",128);
        place_photo.setAttribute("class", "img-rounded");

        //show reviews button

        var reviews_button =  document.createElement("button");
        reviews_button.setAttribute("onmousehover","getReviews('"  + place_id + "');");
        reviews_button.setAttribute("class","btn btn-default dropdown-toggle");
        reviews_button.setAttribute("data-toggle","modal");
        reviews_button.setAttribute("data-target","#div"+place_id);
        reviews_button.innerHTML = "<i class='fa fa-comments'></i> Reviews";
        //staring(rating) div
        var rating_div = document.createElement('span');
        rating_div.setAttribute('class', 'ratingText');
        rating_div.setAttribute('style',"background: #" + places[place_id].ratingColor);
        var rating_star_div = document.createElement('span');
        rating_star_div.setAttribute('class',"rateit");
        rating_star_div.setAttribute('style',"vertical-align: middle");
        rating_star_div.setAttribute('data-rateit-value',places[place_id].rating);
        rating_star_div.setAttribute('data-rateit-ispreset',"true");
        rating_star_div.setAttribute('data-rateit-readonly',"true");
        if(places[place_id].rating<0)
        {
            rating_div.innerHTML = "No rating";
        }else
        {
            rating_div.innerHTML = places[place_id].rating;
        }
        //rating by aspect div
        if(places[place_id].hasOwnProperty('aspects'))
        {
            for(var i=0;i<places[place_id].aspects.length;i++)
            {
                var aspect = places[place_id].aspects[i].type;
                var rating = places[place_id].aspects[i].rating;

                var rating_aspect_div = document.createElement("div");
                rating_aspect_div.setAttribute("class","progress");
                var rating_pourcentage = rating / 30 * 100;
                rating_aspect_div.innerHTML = "<div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width:"+ rating_pourcentage+ "%\">"
                        + aspect + ": " + rating/30 *5 + "/5</div>"

                rating_div.appendChild(rating_aspect_div);
            }
        }





        //review divs
        var reviews_div =  document.createElement("div");
        reviews_div.setAttribute("class","modal fade");
        reviews_div.setAttribute("id","div" + place_id);
        reviews_div.setAtribute("role","dialog");
        //append divs

        placeDiv.appendChild(placeDivWell);
        placeDivWell.appendChild(placeDivRow);
        placeDivRow.appendChild(placeDivCol3);
        placeDivCol3.appendChild(place_photo);
        placeDivRow.appendChild(placeDivCol9);
        placeDivCol9.appendChild(place_name_div);
        placeDivCol9.appendChild(place_desc);
        placeDivCol9.appendChild(place_rating);
        place_rating.appendChild(placeDivCol12);
        placeDivCol12.appendChild(reviews_button);
        placeDivCol12.appendChild(span_separator);
        placeDivCol12.appendChild(rating_star_div);
        placeDivCol12.appendChild(span_separator2);
        placeDivCol12.appendChild(rating_div);
        placeDivCol12.appendChild(reviews_div);
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


function getFoursquareReviews(place_id) {

    var CLIENT_ID = '0JLT1NODQQWLG0C3G5MLPS4GFQKCAK5GBRUI5CQC2W2MX23Q';
    var CLIENT_SECRET = 'REEBOMIXJ0RAZO0D4UTBZXLBBSE5FGNHG05MUTF5P4B1MIXE';
    var reviews_div = document.getElementById('div'+ 'f' + place_id);
    var tips;
    var count = 10;

    reviews_div.innerHTML = "<ul class='list-group'>";

    $.getJSON('https://api.foursquare.com/v2/venues/' + place_id + '/tips/?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160524',
        function (data) {
            tips = data.response.tips.items;
            count = data.response.tips.count;

            for(var i=0; i<count; i++)
            {
                reviews_div.innerHTML += '<li><blockquote>' + tips[i].text + '<footer>' + tips[i].user.firstName + ' ' + tips[i].user.lastName + '</footer>'+ '</blockquote></li>';
            }

            //console.log('tips:' + count);
            //console.log(tips);
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

                    reviews_div.innerHTML += '<li><blockquote>' + reviews_for_a_place[i].text + '<footer>' + reviews_for_a_place[i].author_name + '</footer>'+ '</blockquote></li>';
                }
                reviews_div.innerHTML += "</ul>";
            }
            reviews[place_id] = result.reviews;
        });
    }else
    {
                reviews_for_a_place = reviews[place_id];
                var reviews_div = document.getElementById('div'+ 'g' + place_id);
                reviews_div.innerHTML = "<ul class='list-group'>";
                for(var i=0; i< reviews_for_a_place.length; i++)
                {

                    reviews_div.innerHTML += '<li class="list-group-item"><blockquote>' + reviews_for_a_place[i].text + '<footer>' + reviews_for_a_place[i].author_name + '</footer>'+ '</blockquote></li>';
                }
                reviews_div.innerHTML += "</ul>";
    }
}

function initHere()
{
      here = new H.service.Platform({
      useCIT: true,
      app_id: 'ZUuaVFXcYwWuvaBezozg',
      app_code: 'nn0mL7QtqnXQ6T3Swyh84Q'
    });
}

function cleanPlaces()
{
    places= {};
    var results = document.getElementById("results");
    results.innerHTML = "";
}

function ratingBg(rating)
{
    if(rating < 1) {
        return "EB4D47";
    }

    else if (rating >= 1 && rating < 2){
        return "FF9600";
    }

    else if (rating >= 2 && rating<3) {
        return "FFC800";
    }

    else if (rating >= 3 && rating<4) {
        return "C5DE35";
    }

    else {
        return "73CF42";
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function Integration()
{
   
   for(var placeid in places){
       if(placeid.charAt(0) === 'f' && places[placeid].hasOwnProperty('international_phone_number'))
       {
           for(var place_id in places)
           {
               if(place_id.charAt(0)=== 'g' && places[place_id].hasOwnProperty('international_phone_number'))
               {
                   //compare phone
                   if(!places[place_id].international_phone_number.localeCompare(places[placeid].international_phone_number))
                   {
                       console.log("Merge: " + places[place_id].international_phone_number + places[place_id].name);
                       merge(place_id,placeid);
                           //delete foursquare data
                        delete places[placeid];
                        break;
                   }
               }
           }
       }
       
   }

}

function merge(place_g, place_f)
{
    //merge photo
    if(places[place_g].hasOwnProperty('photo') && places[place_g].photo.indexOf('imageNotFound')>-1)
    {
        if(places[place_f].hasOwnProperty('photo'))
        {
                places[place_g] = places[place_f].photo;
        }
    }
    //merge rating ( sum(percent[i]* rating[i]))
    if(places[place_f].hasOwnProperty('rating'))
    {
        if(places[place_g].hasOwnProperty('rating'))
        {
            if(reviews.hasOwnProperty(place_g) && reviews.hasOwnProperty(place_f))
            {
                var nb_f = reviews[place_f].length; 
                var nb_g = reviews[place_g].length;
                var total = nb_f + nb_g;
                if(nb_f>0 && nb_g>0)
                {
                    places[place_g].rating = nb_g/total * places[place_g].rating + nb_f/total * places[place_g].rating;
                    places[place_g].ratingColor = ratingBg(places[place_g].rating);
                }
            }
        }else
        {
            places[place_g].rating = places[place_f].rating;
        }
    }
    //merge reviews
    if(reviews.hasOwnProperty(place_f))
    {
        if(reviews.hasOwnProperty(place_g))
        {
            reviews[place_g].concat(reviews[place_f]);
        }else
        {
            reviews[place_g] = reviews[place_f];
        }
    }

    onShowButton();
}

function onShowButton()
{
    document.getElementById('results').innerHTML = "";
    for(var key in places)
    {
        showPlace(key);
    }
}