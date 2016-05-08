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

function eventinfos()

{

    var url = document.URL;
    var id = url.substring(url.lastIndexOf('id=') + 1);
    alert(id); // 234234234

    var oArgs = {

        app_key:"MBsKVhQWhpZSW9MP",

        id: id,

        page_size: 25,

        image_sizes: "block100,large,block250",

    };

    EVDB.API.call("/events/get", oArgs, function(oData) {

        // Note: this relies on the custom toString() methods below
        var eventTitle = oData.title;
        var eventCity = oData.city;
        var eventStart = new Date(oData.start_time);
        var eventEnd = new Date(oData.stop_time);

        $('#title').html("<h1>" + eventTitle + "<small> à " + eventCity +"</small></h1>" );
        $('.photos').html("<img src=" + oData.images.image[0].block250.url + "\/>");
        $('.location').html(oData.venue_name);
        $('.start').html("Le " + eventStart.toLocaleDateString("fr-FR") + " à " + eventStart.getHours() + "h");



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