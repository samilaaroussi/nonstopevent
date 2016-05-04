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

    };

    EVDB.API.call("/events/get", oArgs, function(oData) {

        // Note: this relies on the custom toString() methods below
        var eventTitle = oData.title;
        var eventStart = oData.description;
        var eventEnd = oData.start_time;
        var eventPic = oData.stop_time;

        $('#title').html("Title");
        $('.start').html("Start");
        $('.end').html("Event");

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