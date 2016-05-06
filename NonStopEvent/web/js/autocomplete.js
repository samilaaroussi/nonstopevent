/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var autocomplete;
var countryRestrict = {'country': 'fr'};
function init(){
 autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */ (
          document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });
      
      autocomplete.addListener('place_changed', onPlaceChanged);
      
       document.getElementById('country').addEventListener(
      'change', setAutocompleteCountry);
}
      
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
      //document.cookie = "ville="
      get_pop_events();
  } else {
    document.getElementById('autocomplete').placeholder = 'Ville';
  }
  
}

function setAutocompleteCountry() {
  var country = document.getElementById('country').value;
  autocomplete.setComponentRestrictions({'country': country});

}

function search()
{
      var l = document.getElementById('autocomplete').value;
      window.location.href = "events.html?l="+l;
}