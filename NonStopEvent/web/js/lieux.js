/***************** Foursquare API *****************/

var CLIENT_ID = '0JLT1NODQQWLG0C3G5MLPS4GFQKCAK5GBRUI5CQC2W2MX23Q';
var CLIENT_SECRET = 'REEBOMIXJ0RAZO0D4UTBZXLBBSE5FGNHG05MUTF5P4B1MIXE';
var LATLON = '40.7,-74'; //Position de l'évènement
var QUERY = 'hotel';
var i = 0;
var venues = [];

function foursquare() {
    $.getJSON('https://api.foursquare.com/v2/venues/search?ll=40.7,-74&query=' + QUERY + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&limit=10&v=20140806',
        function (data) {
            venues = data;
            console.log("a:" + data);
        });
}

/***************** Foursquare API *****************/
