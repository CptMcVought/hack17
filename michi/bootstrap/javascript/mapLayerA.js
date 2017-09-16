/**
 * Created by nicol on 16.09.2017.
 */

function initialize() {
  initMapA();
}

function initMapA() {
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

  var onChangeHandler2 = function() {
    if (waypts.length > 0) waypts.pop();
    else {
      waypts.push({
        location: latLngC,
        stopover: true
      });
    }
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('route2').addEventListener('mouseover', onChangeHandler2);
}

function calculateAndDisplayRouteA(directionsService, directionsDisplay) {
  //console.log(startLat,startLng);
  //console.log(destinationLat,destinationLng);

  var start = {lat: startLat, lng: startLng};
  directionsService.route({
    origin: start,
    destination: new google.maps.LatLng(destinationLat, destinationLng),
    waypoints: waypts,
    travelMode: document.getElementById('transport').value
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      getTheWayPoints(response, directionsService);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
