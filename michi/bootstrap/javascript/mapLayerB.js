/**
 * Created by nicol on 16.09.2017.
 */

function initialize() {
  initMapB();
}

function initMapB() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 46.90065,
      lng: 8.536703
    },
    zoom: 8
  });

  directionsDisplay.setMap(map);

  var onChangeHandler3 = function() {
    if (waypts.length > 0) waypts.pop();
    else {
      waypts.push({
        location: latLngC,
        stopover: true
      });
    }
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('route2').addEventListener('mouseover', onChangeHandler3);
}
