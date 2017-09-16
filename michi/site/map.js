
      function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 47.39, lng: 8.55}
        });
        directionsDisplay.setMap(map);

        var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('hoi').addEventListener('mouseover', onChangeHandler);
      }

      

      

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var start = {lat: 47.39, lng: 8.55};
        directionsService.route({
          origin: start,
          destination: new google.maps.LatLng(47.390944,8.70444),
          travelMode: 'BICYCLING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }