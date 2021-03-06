/**
 * Created by sami on 04/05/16.
 */
var map;
var places = {};
var reviews = {};
var markers = {};
var placesService;
var categorie ={hotel:{google: "lodging",foursquare:"4bf58dd8d48988d1fa931735",here:"hotel"},
                restaurant:{google:"restaurant",foursquare:"4d4b7105d754a06374d81259",here:"restaurant"},
                bar:{google:"bar",foursquare:"4bf58dd8d48988d116941735",here:"coffee-tea"},
                train_station:{google:"train_station",foursquare:"4bf58dd8d48988d129951735"},
                parking:{google:"parking",foursquare:"4c38df4de52ce0d596b336e1"},
                airport:{google:"airport",foursquare:"4bf58dd8d48988d1ed931735",here:"airport"}
            };
var rankBy = {rating:0, nb_reviews:1};
var here;
var venue;
var geocoder;
var safe_distance = 20;
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
        $.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ LATLON + '&categoryId=' + type +'&radius='+radius+ '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&limit=50&v=20140806' + '&intent=browse',
            function (data) {
                venues = data.response.venues;
                for(var i=0; i<venues.length; i++)
                {

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
                            //lat lng
                             places["f" + data.response.venue.id].labels = ["foursquare"];
                            places["f" + data.response.venue.id].geometry = {};
                            places["f" + data.response.venue.id].geometry.location = {};
                            places["f" + data.response.venue.id].geometry.location.lat = parseFloat(data.response.venue.location.lat);
                            places["f" + data.response.venue.id].geometry.location.lng = parseFloat(data.response.venue.location.lng);
                            //address                        
                            if(data.response.venue.location.hasOwnProperty("address"))
                            {
                                places["f" + data.response.venue.id].vicinity = formatString(data.response.venue.location.address);
                            }
                            if(data.response.venue.hasOwnProperty('rating')) {
                  
                                rating = data.response.venue.rating;
                                places["f" + data.response.venue.id].rating = rating/2;
                                
                                
                                ratingColor = ratingBg(rating/2);
                                places["f" + data.response.venue.id].ratingColor = ratingColor;

                              
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
                                    places["f" + data.response.venue.id].international_phone_number = formatPhone(data.response.venue.contact.formattedPhone);
                                }
                            }
                            //get reviews
                            var f_id = data.response.venue.id;
                             $.getJSON('https://api.foursquare.com/v2/venues/' + f_id + '/tips/?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160524&sort=popular&limit=100',
                             (function (f_id) {
                                 return function(data)
                                 {
                                    var tips = data.response.tips.items;
                                    var count = data.response.tips.count;
                                    if(tips)
                                    {
                                        
                                        reviews['f'+ f_id] = [];
                                        for(var i=0; i<tips.length; i++)
                                        {
                                            
                                            var author_name;
                                            if(tips[i].hasOwnProperty('user'))
                                            {
                                                var first_name = "";
                                                var last_name = "";
                                                if(tips[i].user.hasOwnProperty('firstName'))
                                                {
                                                    first_name = tips[i].user.firstName;
                                                }
                                                 if(tips[i].user.hasOwnProperty('lastName'))
                                                {
                                                    last_name = tips[i].user.lastName;
                                                }
                                                author_name =  first_name+ ' ' + last_name + ' @ foursquare';
                                            }else
                                            {
                                                author_name = "Un utilisateur @ foursquare";
                                            }
                                            var unix_time ="" ;
                                            if(tips[i].hasOwnProperty('createdAt'))
                                            {
                                                unix_time = tips[i].createdAt;
                                            }
                                            reviews['f'+ f_id].push({author_name: author_name,
                                                                     time: unix_time,
                                                                     text: tips[i].text});
                                        }
                                        /*
                                        var div = document.getElementById('f' + f_id);
                                        if(div)
                                        {
                                            div.setAttribute("nb_reviews",count);
                                            var span = document.getElementById('f'+f_id+"_span");
                                            if(span)
                                            {
                                                span.innerHTML = count;
                                            }
                                        }
                                         */
                                    }
                                    showPlace("f" + f_id);
                                 }

                                }(f_id)));
                                
                        }
                    );
                }

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

        image_sizes: "block,block178,large,medium"

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
        var event_image ="";
        if(oData.images.image.hasOwnProperty('medium'))
        {
            event_image = oData.images.image;
        }else
        {
            event_image = oData.images.image[0];
        }
        $('#title').html("<h2>" + eventTitle + "</h2>" );
        $('.photos').html("<img class=\"img-rounded\" src=" + event_image.medium.url + "\/>");
        $('.location').html(oData.venue_name);
        $('.start').html("<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> Le " + eventStart.toLocaleDateString("fr-FR") + " à " + eventStart.getHours() + "h");
        $('#blurBg').backgroundBlur({
            imageURL : event_image.large.url,
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
            var deg = Math.round(resp.main.temp);

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
    icon: 'images/icon_blue.png'  });
    });
geocoder = new google.maps.Geocoder;
}



function init() {
  //get parametre l in url

        map = new google.maps.Map(document.getElementById('map'), {
        });
        //initHere();

}

function onSearchButton()
{
    //clean last search result
    cleanPlaces();
    cleanMarkers();
    //change google map size
     $('#googlemap').removeClass('col-md-12');
    $('#googlemap').addClass('col-md-6');
    $('#googlemap').css( "position", "fixed" );

    //re-center google map
    google.maps.event.trigger(map, "resize");
    var descDiv = document.getElementById('desc');
    var latitude = descDiv.getAttribute('latitude');
    var longitude = descDiv.getAttribute('longitude');
   
    //console.log(parseFloat(latitude) +' ' + parseFloat(longitude));
    var myLatLng = new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));
    map.setCenter(myLatLng);
    map.setZoom(14);


    var type = document.getElementById('type').value;
    var radius =  parseInt(document.getElementById('radius').value);

    search(categorie[type].google,radius);
    //search foursquare
    addPlaces(categorie[type].foursquare,radius);
    //searchHere
    //searchHerePlaces(categorie[type].here,radius);
  if(type === "hotel")
  {
    searchExpedia(radius/1000);
  }
    
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
                    places[placeId] = results[i];
                    /*
                    //place id
                    places[placeId].place_id = results[i].place_id;
                    //latlng
                    places[placeId].geometry = {};
                    places[placeId].geometry.location = {};
                    places[placeId].geometry.location.lat = results[i].geometry.location.lat;
                    places[placeId].geometry.location.lng = results[i].geometry.location.lng;
                    */
                    //get place detail
                    setTimeout(function(param){    
                    placesService.getDetails(param,function(result, stat){
                        
                        if(stat === google.maps.places.PlacesServiceStatus.OK)
                        {   //place id
                            var placeId = 'g' + result.place_id;
                            //place name
                            places[placeId].name = result.name;
                            places[placeId].labels = ["google"];
                            //address
                            if(result.hasOwnProperty('vicinity'))
                            {
                                places[placeId].vicinity = formatString(result.vicinity);
                            }
                             ;
                            //clean data
                            if( (!result.hasOwnProperty('photos'))&& (!result.hasOwnProperty('rating')) && (!result.hasOwnProperty('reviews')))
                            {
                                delete places[placeId];
                                return;
                            }
                            //phone number
                             if(result.hasOwnProperty('international_phone_number'))
                             {
                                places[placeId].international_phone_number = formatPhone(result.international_phone_number);   
                              }
                              //photos
                    if(result.hasOwnProperty("photos"))
                    {
                         places[placeId].photo= result.photos[0].getUrl({maxHeight:256,maxWidth:256});
                         //places[placeId].photos = result.photo;
                         
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
                        var g_reviews =  result.reviews;
                        for(var i=0; i<g_reviews.length; i++)
                        {
                            g_reviews[i].author_name += " @ google";
                        }
                        reviews[placeId] = g_reviews;
                     }
                     //marker
                     markers[placeId] = new google.maps.Marker({
                        position: result.geometry.location,
                        map: map,
                        animation: google.maps.Animation.DROP
                    });

                    markers[placeId].place_id =  placeId;
                    var info = new google.maps.InfoWindow({
                        content: places[placeId].name
                    });
                            markers[placeId].addListener('mouseover', function() {
                                info.open(map, this);
                            });

                            markers[placeId].addListener('mouseout', function() {
                                info.close();
                            });

                            markers[placeId].addListener('click', function() {
                        document.getElementById(this.place_id).scrollIntoView(); });
                    
                    showPlace('g' + result.place_id);
                        }else
                        {
                            console.log("get place detail exception status: "+ status);
                            delete places['g' + param.placeId];
                            count_g++;
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
        placeDiv.setAttribute("onmouseover","getReviews('"  + place_id + "');");
        placeDiv.setAttribute("rating",place.rating);
        var nb_reviews = 0;
        if(reviews.hasOwnProperty(place_id))
        {
            nb_reviews = reviews[place_id].length;
        }
            placeDiv.setAttribute("nb_reviews",nb_reviews);
        
        
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

        reviews_button.setAttribute("type","button");
        reviews_button.setAttribute("class","btn btn-default");
        reviews_button.setAttribute("data-toggle","modal");
        reviews_button.setAttribute("data-target","#reviews");
        reviews_button.innerHTML = "<i class='fa fa-comments'></i> Reviews<span id ='" +   place_id + "_span' class='badge'>" + nb_reviews + "</span>";
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
                rating_aspect_div.innerHTML = "<div  class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width:"+ rating_pourcentage+ "%\">"
                        + aspect + ": " + rating/30 *5 + "/5</div>";

                rating_div.appendChild(rating_aspect_div);
            }
        }        


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
        for(var i=0; i<place.labels.length; i++)
        {
            var span_label = document.createElement("span");
            if(i===0)
            {
                span_label.style.marginLeft = "10px";
            }else
            {
                span_label.style.marginLeft = "5px";
            }
            switch(place.labels[i])
            {
                case "google": 
                    span_label.setAttribute("class","label label-primary");
                    break;
                case "foursquare": 
                    span_label.setAttribute("class","label label-success");
                    break;
                 case "expedia": 
                    span_label.setAttribute("class","label label-warning");
                    break;
            }
            span_label.innerHTML = place.labels[i];
            placeDivCol12.appendChild(span_label);
        }
        //placeDivCol12.appendChild(reviews_div);
        var sort = parseInt(document.getElementById("rankBy").value);
        if(sort === rankBy.rating)
        {
            insert_div(results,placeDiv,rankBy.rating);
        }else if(sort === rankBy.nb_reviews)
        {
            insert_div(results,placeDiv,rankBy.nb_reviews);
        }
        //results.appendChild(placeDiv);

        $('div.rateit, span.rateit').rateit();
        
}

function insert_div(resultsDiv,placeDiv, rank)
{
    if(!resultsDiv.hasChildNodes())
    {
        resultsDiv.appendChild(placeDiv);
        return;
    }
    if(rank===rankBy.rating)
    {
         for(var i=0; i<resultsDiv.childNodes.length; i++)
        {
            var rating = parseFloat(placeDiv.getAttribute("rating"));
            var _rating = parseFloat(resultsDiv.childNodes[i].getAttribute("rating"));

            if(rating >_rating )
            {
                resultsDiv.insertBefore(placeDiv, resultsDiv.childNodes[i]);
                return;
            }
        }
        resultsDiv.appendChild(placeDiv);
    }
    else if(rank=== rankBy.nb_reviews)
    {
        for(var i=0; i<resultsDiv.childNodes.length; i++)
        {
        var nb_reviews = parseFloat(placeDiv.getAttribute("nb_reviews"));
        var _nb_reviews = parseFloat(resultsDiv.childNodes[i].getAttribute("nb_reviews"));

            if(nb_reviews >_nb_reviews )
            {
                resultsDiv.insertBefore(placeDiv, resultsDiv.childNodes[i]);
                return;
            }
        }
        resultsDiv.appendChild(placeDiv);
    }
}
function getReviews(place_id)
{
    /*
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
    */
    if(!reviews.hasOwnProperty(place_id))
    {
        var modal_header = document.getElementById("place_name");
        modal_header.innerHTML = places[place_id].name;
        var modal_body = document.getElementById("reviews_list");
        modal_body.innerHTML = "This place has not been commented yet";
        return;
    }
                var reviews_for_a_place;
    
                reviews_for_a_place = reviews[place_id];
                var reviews_div = document.getElementById("reviews");
                var modal_header = document.getElementById("place_name");
                modal_header.innerHTML = places[place_id].name;
                var modal_body = document.getElementById("reviews_list");
                modal_body.innerHTML = "<ul class='list-group'>";
                for(var i=0; i< reviews_for_a_place.length; i++)
                {
					var time;
					if(reviews_for_a_place[i].hasOwnProperty('formattedTime'))
					{
						time = reviews_for_a_place[i].formattedTime;
					}else
					{ 
						time = timeConverter(reviews_for_a_place[i].time);
					}
				
                    modal_body.innerHTML += '<li class="list-group-item"><blockquote> <div class="row" style="max-height:100px;overflow-y: scroll">' + reviews_for_a_place[i].text + '</div><footer>' + reviews_for_a_place[i].author_name + 
                                            ' ' +  time +  '</footer>'+ '</blockquote></li>';
                }
                modal_body.innerHTML += "</ul>";
}


function getFoursquareReviews(place_id) {

    var CLIENT_ID = '0JLT1NODQQWLG0C3G5MLPS4GFQKCAK5GBRUI5CQC2W2MX23Q';
    var CLIENT_SECRET = 'REEBOMIXJ0RAZO0D4UTBZXLBBSE5FGNHG05MUTF5P4B1MIXE';
    var reviews_div = document.getElementById('reviews_list');
    var place_name_div = document.getElementById('place_name');
    place_name_div.innerHTML = places['f' + place_id].name;
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
    if(!reviews.hasOwnProperty('g' + place_id))
    {
        var modal_header = document.getElementById("place_name");
        modal_header.innerHTML = places['g' + place_id].name;
        var modal_body = document.getElementById("reviews_list");
        modal_body.innerHTML = "This place has not been commented yet";
        return;
    }
                var reviews_for_a_place;
    
                reviews_for_a_place = reviews['g' + place_id];
                var reviews_div = document.getElementById("reviews");
                var modal_header = document.getElementById("place_name");
                modal_header.innerHTML = places['g' + place_id].name;
                var modal_body = document.getElementById("reviews_list");
                modal_body.innerHTML = "<ul class='list-group'>";
                for(var i=0; i< reviews_for_a_place.length; i++)
                {

                    modal_body.innerHTML += '<li class="list-group-item"><blockquote>' + reviews_for_a_place[i].text + '<footer>' + reviews_for_a_place[i].author_name + '</footer>'+ '</blockquote></li>';
                }
                modal_body.innerHTML += "</ul>";
        
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
    delete places;
    delete reviews;
    var results = document.getElementById("results");
    results.innerHTML = "";
    places = {};
    reviews = {};
    
}

function cleanMarkers()
{
    for(var key in markers)
    {
        markers[key].setMap(null);
    }
    markers = {};
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
    //google place id union
    var g_places_id = [];
    //non-google place id union
    var f_places_id = [];
    for(var place_id in places)
       {
           if(place_id.charAt(0) === 'f' || place_id.charAt(0)==='e')
           {
               f_places_id.push(place_id);
           }else if( place_id.charAt(0) === 'g')
           {
               g_places_id.push(place_id);
           }
       }
   
   for(var i=0; i<f_places_id.length; i++){
       
       var placeid = f_places_id[i];
       for(j=0; j<g_places_id.length;j++)
       {
            var place_id = g_places_id[j];
            //integration based on phone number
            if(places[placeid].hasOwnProperty('international_phone_number'))
            {
                    if( places[place_id].hasOwnProperty('international_phone_number'))
                    {     //compare phone
                        if(!places[place_id].international_phone_number.localeCompare(places[placeid].international_phone_number))
                        {
                                var source_type = "foursquare";
                                if(placeid.charAt(0) === 'e')
                                {
                                    source_type = "expedia   ";
                                }
                                console.log("Merge with phone number: " + places[place_id].international_phone_number + "\n" + source_type + " : " + places[placeid].name + "\ngoogle    : " + places[place_id].name);
                            
                            merge(place_id,placeid);
                             break;
                        }
                    }    
              //compare address
            }else  if(places[placeid].hasOwnProperty('vicinity'))
            {
                     if(places[place_id].hasOwnProperty('vicinity'))
                     {
                        if(places[place_id].vicinity.indexOf ( places[placeid].vicinity ) > -1)
                        {
                            var source_type = "foursquare";
                                if(placeid.charAt(0) === 'e')
                                {
                                    source_type = "expedia   ";
                                }
                                console.log("Merge with address: " + places[place_id].vicinity + "\n" + source_type + " : "+ places[placeid].name + "\ngoogle    : " + places[place_id].name);
                
                            merge(place_id,placeid);
                            break;
                        }            
                     }
            }
     }
   }
   
    //non-google place id union
    f_places_id = [];
    for(var place_id in places)
       {
           if(place_id.charAt(0) === 'f' || place_id.charAt(0) === 'e')
           {
               f_places_id.push(place_id);
           }
       }
       //merge by distance
    for(var i=0; i<f_places_id.length; i++){
       
       var placeid = f_places_id[i];
       for(j=0; j<g_places_id.length;j++)
       {
            var place_id = g_places_id[j];
            var lat1 = places[placeid].geometry.location.lat;
            var lng1 = places[placeid].geometry.location.lng;
            var lat2 = places[place_id].geometry.location.lat();
            var lng2 = places[place_id].geometry.location.lng();
            var dist = getDistanceFromLatLonInMeter(lat1,lng1,lat2,lng2);
            if( dist < safe_distance)
            {
                 var source_type = "foursquare";
                 if(placeid.charAt(0) === 'e')
                 {
                    source_type = "expedia   ";
                 }
                console.log("Merge by distance: "+ dist + "m" + "\n"+ source_type + " : " + places[placeid].name + "\ngoogle    : " + places[place_id].name);
                merge(place_id,placeid)
                break;
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
                places[place_g].photo = places[place_f].photo;
                if(!places[place_g].hasOwnProperty('photos'))
                {
                    places[place_g].photos = [];
                }
                if(places[place_f].hasOwnProperty('photos'))
                {
                    places[place_g].photos.concat( places[place_f].photos);
                }
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
                    places[place_g].rating = nb_g/total * places[place_g].rating + nb_f/total * places[place_f].rating;                   
                    places[place_g].rating = places[place_g].rating.toFixed(2);
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
            reviews[place_g] = reviews[place_g].concat(reviews[place_f]);
        }else
        {
            reviews[place_g] = reviews[place_f];
        }
    }
    //merge label
    places[place_g].labels = places[place_g].labels.concat(places[place_f].labels);
     //delete foursquare data
                        delete places[place_f];
                        //delete correspond div
                        var google_div = document.getElementById(place_g);
                        var four_div = document.getElementById(place_f);
                        if(google_div)
                        {
                            google_div.parentNode.removeChild(google_div);
                        }
                        if(four_div)
                        {
                            four_div.parentNode.removeChild(four_div);
                        }
                        //show new merge result
                        showPlace(place_g);
    
}

function formatString(str)
{
    var result = str.toLowerCase();
    result = result.replace("avenue"," ave");
    result = result.replace("street"," st");
    //split by whitespace
    result = result.split(',');
    //trim whitespace
    result[0] =  result[0].replace(/  +/g, ' ');
    if(result[0].length<5 && result.length>1)
    {
        result = result[0] + result[1];
    }else
    {
        result = result[0];
    }
    result =  result.replace(/  +/g, ' ');
    
    return result;
}

function formatPhone(phone)
{
    //trim

     var result = phone.replace('\+1','');
     result = result.replace(/  +/g, ' ');
     result = result.replace(/\s/g,'');
     result = result.replace(/\-/g,'');
     result = result.replace(/\+/g,'');
     result = result.replace(')','');
     result = result.replace('(','');
    return result;
}

function getDistanceFromLatLonInMeter(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in meter
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function timeConverter(UNIX_timestamp){
  if((typeof UNIX_timestamp!=='undefined'))
  {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
     var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  return "";
}

function searchExpedia(radius)
{

    var descDiv = document.getElementById('desc');
    var latitude = parseFloat(descDiv.getAttribute("latitude"));
    var longitude = parseFloat(descDiv.getAttribute("longitude"));
    
    var params = {
        within: radius.toFixed(2) + 'km',
        lat: latitude,
        lng: longitude
    };

    $.ajax({
            url: "http://terminal2.expedia.com:80/x/geo/hotels",
            dataType: "json",
            data: params,
            type: "GET",
            headers: {"Authorization":"expedia-apikey key=6OGIn9cQogbS3gphuJs2wv7KHDHaBScu"},
            success :  function(results) {
                for(var i=0; i<results.length;i++)
                {
                    var hotel = results[i];
                    var place_id = 'e' + hotel.source.srcId;
                    
                    if(! places.hasOwnProperty(place_id))
                    {
                        places[place_id] = {};
                        places[place_id].labels = ["expedia"];
                        places[place_id].place_id = place_id;
                        places[place_id].geometry = {};
                        places[place_id].geometry.location = {lat:hotel.position.coordinates[1],lng:hotel.position.coordinates[0]};
                        places[place_id].name = hotel.name;
                    }
                
                //get hotel detail
                $.ajax({
                        url: "http://terminal2.expedia.com:80/x/mhotels/info?hotelId=" + hotel.source.srcId,
                        dataType: "json",
                        type: "GET",
                        headers: {"Authorization":"expedia-apikey key=6OGIn9cQogbS3gphuJs2wv7KHDHaBScu"},
                        success :  function(detail) {
                            var place_id = 'e' + detail.hotelId;
                            
                            if(detail.hasOwnProperty('hotelAddress'))
                            {
                                places[place_id].vicinity =  formatString(detail.hotelAddress);
                            }
                            if(detail.hasOwnProperty('photos'))
                            {
                                places[place_id].photo = 'http://images.trvl-media.com' + detail.photos[0].url;
                                places[place_id].photos = [];
                                for(var j=0; j<detail.photos.length;j++)
                                {
                                    places[place_id].photos.push('http://images.trvl-media.com'+ detail.photos[j].url);
                                }
                                
                            }
                            if(detail.hasOwnProperty('hotelGuestRating'))
                            {
                                places[place_id].rating = detail.hotelGuestRating;    
                                places[place_id].ratingColor = ratingBg(detail.hotelGuestRating);
                            }else
                            {
                                places[place_id].rating = -1;
                                places[place_id].ratingColor = ratingBg(places[place_id].rating);
                            }
                            /*                       
                            if(detail.hasOwnProperty('telesalesNumber'))
                            {
                                places[place_id].international_phone_number = formatPhone(detail.telesalesNumber);
                            }
                            */
                        
                        
                         //get hotel reviews
                var review_params = {hotelId: detail.hotelId, 
                                        summary:false,
                                        items: 20
                        };
                 $.ajax({
                        url: "http://terminal2.expedia.com:80/x/reviews/hotels",
                        dataType: "json",
                        data: review_params,
                        type: "GET",
                        hotelId: detail.hotelId,
                        headers: {"Authorization":"expedia-apikey key=6OGIn9cQogbS3gphuJs2wv7KHDHaBScu"},
                        success :  function(results) {
                            var place_id = 'e' + this.hotelId;
                            var list = results.reviewDetails.reviewCollection.review;
                            if(list.length >0)
                            {
                                reviews[place_id] = [];
                                for(var j=0; j<list.length;j++)
                                {
                                    var review = {};
                                    var author_name = "Un utilisateur";
                                    if(list[j].hasOwnProperty('userNickname') && list[j].userNickname.length>0)
                                    {
                                        author_name = list[j].userNickname;
                                    }
                                    author_name += " @ Expedia";
                                    review.author_name = author_name;
                                    review.text =  list[j].reviewText;
                                    review.formattedTime = list[j].reviewSubmissionTime.replace(/[a-zA-Z]/g,' ');
                                    reviews[place_id].push(review);
                                }
                            }
                            
                            showPlace( place_id);
                        }
                    });
                  }
                  });
               
                }

        }
    });
}
