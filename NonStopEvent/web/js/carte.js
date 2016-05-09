var map;
function initMap() {
  
  document.getElementById("right").style.height = document.getElementById("result").scrollHeight + "px";
  var mapContainer = document.getElementById("mapContainer");
  console.log(document.getElementById("right").clientWidth);
  mapContainer.style.width = document.getElementById("right").clientWidth + "px";
  mapContainer.style.height = '500px';
  mapContainer.style.top= "100px";
  mapContainer.setAttribute("data-spy","affix");
  mapContainer.setAttribute("data-offset-top",document.getElementById("right").getBoundingClientRect().top); 
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
  
}