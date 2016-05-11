/**
 * Created by sami on 11/05/16.
 */
function gettingJSON(){
    document.write("jquery loaded");
$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=London&APPID=ee6596241130f193adf1ba90e625cc10",function(json){
    document.write(JSON.stringify(json));
});
}