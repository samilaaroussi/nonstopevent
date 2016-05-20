
<<<<<<< HEAD
function foursquare() {
    $.getJSON('https://api.foursquare.com/v2/venues/search?ll=40.7,-74&query=' + QUERY + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&limit=10&v=20140806',
        function (data) {
            venues = data.response.venues;
            for(var i=0; i<venues.length; i++)
            {
                console.log(venues[i].name);
                console.log(venues[i].id);
                places[venues[i].id] = venues[i];
            }
            
        });
}
=======
>>>>>>> origin/master

/***************** Foursquare API *****************/
