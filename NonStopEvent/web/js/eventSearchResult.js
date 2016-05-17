
var events = [];
var page_num = 1;
var page_count = 0;
var current_page = 0;
var result_divs = [];
events[0] = [];
var map;
var markers = [];
var infoWindows = [];
function getAllEvents()
{
  var l = getQueryString('l');
  var oArgs = {
            app_key:"MBsKVhQWhpZSW9MP",
            location: l,
            page_size: 20 ,
            sort_order: 'popularity',
            sort_direction: 'descending',
            page_number:page_num  
  };

  EVDB.API.call("/events/search", oArgs, function(oData) {

      // Note: this relies on the custom toString() methods below
      page_count = oData.page_count;
      current_page = oData.page_number;
      events[current_page] = [];
      for(var i=0 ;i < oData.events.event.length; i++)
      {
          
          var event =  oData.events.event[i];

          events[current_page][i] = new Object();
          events[current_page][i].latitude = event.latitude;
          events[current_page][i].longitude = event.longitude;
          events[current_page][i].title = event.title;
          events[current_page][i].id = event.id;
          events[current_page][i].start_time = event.start_time;
          events[current_page][i].stop_time = event.stop_time;
          events[current_page][i].venue_address = event.venue_address;
          events[current_page][i].image = new Object();
          if(event.image===null)
          {
              events[current_page][i].image.url = null;
          }else{
                    if(event.image.medium!=='null' && event.image.medium!==null)
                   {
                     events[current_page][i].image.url = event.image.medium.url;
                   }else
                   {
                       events[current_page][i].image.url = event.image.url;
                   }
            }
          events[current_page][i].description = event.description;
      }
      show_events(current_page);
    });
    page_num++;
}

function show_events(page_number)
{
    if(events[page_number]===null)
        return;
    for(var i=0; i<events[page_number].length;i++)
    {
        var panel_div = document.createElement("div");
        var heading_div = document.createElement("div");
        var title_h4 = document.createElement("h4");
        var title_a = document.createElement("a");
        var title_img = document.createElement("img");
            if(events[page_number][i].image.url === null)
                events[page_number][i].image.url = "images/imageNotFound.jpg";
        title_img.src = events[page_number][i].image.url;
        
        title_a.setAttribute("data-toggle","collapse");
        title_a.setAttribute("data-parent","#result");
        //title_a.setAttribute("href","#"+events[page_number][i].id);
        title_a.setAttribute("href","#"+i);
        title_a.innerHTML = events[page_number][i].title;
        title_h4.setAttribute("class","panel-title");
        
        heading_div.setAttribute("class","panel-heading");
        
        panel_div.setAttribute("class","panel panel-default");
        
        var collapse_div = document.createElement("div");
        var body_div = document.createElement("div");
        var table = document.createElement("table");
        table.setAttribute("class","table table-hover");
        table.innerHTML = "<tbody>";
        table.innerHTML +="<tr><td>From:</td><td>"+events[page_number][i].start_time + "</td></tr>";
        table.innerHTML +="<tr><td>To:</td><td>"+events[page_number][i].end_time + "</td></tr>";
        table.innerHTML +="<tr><td>Address:</td><td>"+events[page_number][i].venue_address + "</td></tr>";
        table.innerHTML += "<tr><td><a href='event.html?id="+ events[page_number][i].id + "'>Plus information</a></td></tr>"
        table.innerHTML +="</tbody>";
        
        //collapse_div.setAttribute("id",events[page_number][i].id);
        collapse_div.setAttribute("id",""+i);
        collapse_div.setAttribute("class","panel-collapse collapse");

        
        body_div.setAttribute("class","panel-body");
        body_div.appendChild(table);
        
        //heading_div.setAttribute("longitude",events[page_number][i].longitude);
        //heading_div.setAttribute("latitude",events[page_number][i].latitude);
         var myLatLng = {lng: parseFloat(events[page_number][i].longitude),
                    lat: parseFloat(events[page_number][i].latitude)};
        var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                animation: google.maps.Animation.DROP,
            });
            
        markers.push(marker);
        var contentString = events[page_number][i].title;
        var infowindow = new google.maps.InfoWindow({                   
                    content: contentString
        });
        infoWindows.push(infowindow);
        heading_div.onmouseover = function() {
                var h4 = this.children[0];
                var a = h4.children[0];
                var href = a.getAttribute("href");
                var index = parseInt(href.substring(1));
                
                map.setCenter(markers[index].position);
                map.setZoom(12);
                
                
                infoWindows[index].open(map, markers[index]);
        };
        heading_div.onmouseout = function(){
                            var h4 = this.children[0];
                var a = h4.children[0];
                var href = a.getAttribute("href");
                var index = parseInt(href.substring(1));
                infoWindows[index].close();
        };
        
        title_a.appendChild(title_img);
        title_h4.appendChild(title_a);
        
        heading_div.appendChild(title_h4);
        collapse_div.appendChild(body_div);

        panel_div.appendChild(heading_div);
        panel_div.appendChild(collapse_div);
        
        document.getElementById("result").appendChild(panel_div);
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    }


function initMap() {
  
  document.getElementById("right").style.height = document.getElementById("result").scrollHeight + "px";
  var mapContainer = document.getElementById("mapContainer");
  console.log(document.getElementById("right").clientWidth);
  mapContainer.style.width = document.getElementById("right").clientWidth + "px";
  mapContainer.style.height = '500px';
  mapContainer.style.top= "100px";
  mapContainer.setAttribute("data-spy","affix");
  mapContainer.setAttribute("data-offset-top",document.getElementById("right").getBoundingClientRect().top); 
  //get parametre l in url
   var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': getQueryString('l')}, function(results, status) {
    
    if (status === google.maps.GeocoderStatus.OK) 
    {
        map = new google.maps.Map(document.getElementById('map'), {
        center: results[0].geometry.location,
        zoom: 10
        });
    }
  }); 
}