var events = [];
var page_num = 1;
var pop_events_divs = [];
function get_pop_events()
{
  clear_pop_events();
  var l = document.getElementById('autocomplete').value;
  var oArgs = {
            app_key:"MBsKVhQWhpZSW9MP",
            location: l,
            page_size: 9 ,
            sort_order: 'popularity',
            sort_direction: 'descending',
            page_number:page_num  
  };

  EVDB.API.call("/events/search", oArgs, function(oData) {

      // Note: this relies on the custom toString() methods below
      for(var i=0 ;i < oData.events.event.length; i++)
      {
          var event =  oData.events.event[i];
          events[i] = new Object();
          events[i].latitude = event.latitude;
          events[i].longitude = event.longitude;
          events[i].title = event.title;
          events[i].id = event.id;
          events[i].start_time = event.start_time;
          events[i].stop_time = event.stop_time;
          events[i].venue_address = event.venue_address;
          events[i].image = new Object();
          if(event.image===null)
          {
              events[i].image.url = null;
          }else{
                    if(event.image.medium!=='null' && event.image.medium!==null)
                   {
                     events[i].image.url = event.image.medium.url;
                   }else
                   {
                       events[i].image.url = event.image.url;
                   }
            }
          events[i].description = event.description;
      }
      show_more_events(0,events.length-1); 
    });
    page_num++;
}

function get_more_pop_events()
{
  var l = document.getElementById('autocomplete').value;
  var oArgs = {
            app_key:"MBsKVhQWhpZSW9MP",
            location: l,
            page_size: 9 ,
            sort_order: 'popularity',
            sort_direction: 'descending',
            page_number:page_num  
  };

  EVDB.API.call("/events/search", oArgs, function(oData) {

      // Note: this relies on the custom toString() methods below
      var debut = events.length;
      var i = events.length;
      for(var j=0 ;j < oData.events.event.length; j++)
      {
          var event = oData.events.event[j];
          events[i] = new Object();
          events[i].latitude = event.latitude;
          events[i].longitude = event.longitude;
          events[i].title = event.title;
          events[i].id = event.id;
          events[i].start_time = event.start_time;
          events[i].stop_time = event.stop_time;
          events[i].venue_address = event.venue_address;
          events[i].image = new Object();
          if(event.image===null)
          {
              events[i].image.url = null;
          }else
          {
                if(event.image.medium!==null)
                {
                  events[i].image.url = event.image.medium.url;
                }else
                {
                    events[i].image.url = event.image.url;
                }
            }
          events[i].description = event.description;
          i++;
      }
      show_more_events(debut, events.length -1); 
      
    });
    page_num++;
}

function show_more_events(debut, fin)
{
    for(var i = debut; i<=fin;i++)
    {
    var divContainer = document.createElement("div");
    divContainer.className = "col-sm-4";
    var div = document.createElement("div");
    div.id = events[i].id;
    div.city = events[i].city;
    div.className = "well well-sm";
    div.style.cursor = 'pointer';
    div.onclick = function(){ window.location.href = "event.html?id="+ this.id;};
    div.onmouseover = function() { this.style.backgroundColor = '#c2c2d6';};
    div.onmouseout = function() { this.style.backgroundColor = '';};
    var img = document.createElement("img");
    if(events[i].image.url === null)
        events[i].image.url = "images/imageNotFound.jpg";
    img.src = events[i].image.url;
    var title = document.createElement("p");
    title.textContent = events[i].title;

    div.appendChild(img);
    div.appendChild(title);
    /*
    var description = document.createElement("p");
    description.textContent = events[i].description;
    div.appendChild(description);
    */
    divContainer.appendChild(div);
    
    document.getElementById("pop_events").appendChild(divContainer);
    pop_events_divs.push(divContainer);
    }
    document.getElementById("more").hidden = false;
}

function clear_pop_events()
{
    page_num = 1;
    events= [];
    var pop_events_container = document.getElementById("pop_events");
    for(var i=0; i<pop_events_divs.length;i++)
    {
        pop_events_container.removeChild(pop_events_divs[i]);
    }
}

