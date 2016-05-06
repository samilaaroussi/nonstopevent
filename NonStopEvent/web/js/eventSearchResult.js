
var events = [];
var page_num = 1;
var page_count = 0;
var current_page = 0;
var result_divs = [];
events[0] = [];
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
        
        title_a.setAttribute("data-toggle","collapse");
        title_a.setAttribute("data-parent","#result");
        title_a.setAttribute("href","#"+events[page_number][i].id);
        title_a.innerHTML = events[page_number][i].title;
        //title_a.setAttribute("aria-expanded","false");
        title_h4.setAttribute("class","panel-title");
        
        heading_div.setAttribute("class","panel-heading");
        
        panel_div.setAttribute("class","panel panel-default");
        
        var collapse_div = document.createElement("div");
        var body_div = document.createElement("div");
        
        collapse_div.setAttribute("id",events[page_number][i].id);
        collapse_div.setAttribute("class","panel-collapse collapse in");
        //collapse_div.setAttribute("aria-expanded","false");
        
        body_div.setAttribute("class","panel-body");
        body_div.innerHTML = events[page_number][i].description;
         
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
