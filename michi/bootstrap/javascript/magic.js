function initialize() {
    initMap();
    initAutocomplete();
    initDestinationAutocomplete();
}
var map, marker, startLat, startLng, destinationLat, destinationLng;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
    directionsDisplay.setMap(map);

    var onChangeHandler = function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('submit').addEventListener('click', onChangeHandler);
}
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete, destinationAutocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('origin')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function initDestinationAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    destinationAutocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('destination')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    destinationAutocomplete.addListener('place_changed', fillInDestinationAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
    }
    if (!marker) {
        marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });
    } else marker.setMap(null);
    marker.setOptions({
        position: place.geometry.location,
        map: map
    });

    startLat = autocomplete.getPlace().geometry.location.lat();
    startLng = autocomplete.getPlace().geometry.location.lng();
}

function fillInDestinationAddress() {
    // Get the place details from the autocomplete object.
    var place = destinationAutocomplete.getPlace();
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
    }
    if (!marker) {
        marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });
    } else marker.setMap(null);
    marker.setOptions({
        position: place.geometry.location,
        map: map
    });

    destinationLat = destinationAutocomplete.getPlace().geometry.location.lat();
    destinationLng = destinationAutocomplete.getPlace().geometry.location.lng();
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    console.log(startLat,startLng);
    console.log(destinationLat,destinationLng);

    var start = {lat: startLat, lng: startLng};
    directionsService.route({
        origin: start,
        destination: new google.maps.LatLng(destinationLat, destinationLng),
        travelMode: document.getElementById('transport').value
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            getTheWayPoints(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


function getTheWayPoints(response) {
    console.log(response.routes[0].legs[0].steps.length);
    console.log(response.routes[0].legs[0].steps[0].lat_lngs[0].lat());

    var numbOfPoints = response.routes[0].legs[0].steps.length;
    var wayPointLat = new Array;
    var wayPointLng = new Array;

    for (var i = 0; i < numbOfPoints; i++){
      wayPointLat[i] = response.routes[0].legs[0].steps[i].lat_lngs[0].lat();
      wayPointLng[i] = response.routes[0].legs[0].steps[i].lat_lngs[0].lng()
      //Timi da chunnt din JSON GAGGI iä
    }
}
