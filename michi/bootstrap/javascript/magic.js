var map, marker, startLat, startLng, destinationLat, destinationLng;
var latLngC, latLngD, latLngA;
var routeValueA, routeValueB, routeValueC, beschti;
var weatherPointsA, weatherPointsB, weatherPointsC;
var highlight = 0;
var resulti = [];
var leaderboard = [];
var readyRender = false;
var active = 0;
var counter = 0;

var directionsRenderer1,directionsRenderer2,directionsRenderer3;


function initialize() {
  drawMap();
  initAutocomplete();
  initDestinationAutocomplete();

  var start = new google.maps.LatLng(47,8);
  var myOptions = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: start
  }

  map = new google.maps.Map(document.getElementById('map'), myOptions);


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

function getTheWayPoints(response) {
  //console.log(response.routes[0].legs[0].steps.length);
  //console.log(response.routes[0].legs[0].steps[0].lat_lngs[0].lat());
  //console.log(response.routes);

  var numbOfPoints = response.routes[0].legs[0].steps.length;
  var numbOfWeatherpoints = Math.round(numbOfPoints/20)
  var wayPointLat = new Array;
  var wayPointLng = new Array;
  var weatherPoint = new Array;

  var maxprobability = 50;
  var routevalue = 0;


  for (var i = 0; i < numbOfPoints; i++){
    wayPointLat[i] = response.routes[0].legs[0].steps[i].lat_lngs[0].lat();
    wayPointLng[i] = response.routes[0].legs[0].steps[i].lat_lngs[0].lng();
    if (i % numbOfWeatherpoints == 0) {
      /*if (geocode_weather(wayPointLat[i],wayPointLng[i]).probability > maxprobability) {
       window.alert("It's raining cats and dogs");
       return -1; // Abbruch
       }
       else */weatherPoint[i/numbOfWeatherpoints] = geocode_weather(wayPointLat[i],wayPointLng[i]).expectation;
    }
  }

  for (var j = 0; j < weatherPoint.length; j++) {
    routevalue += weatherPoint[j];
  }
  console.log(routevalue);
  distanceStuff();

  if(counter == 0) weatherPointsA = weatherPoint.length;
  else if(counter == 1) weatherPointsB = weatherPoint.length;
  else weatherPointsC = weatherPoint.length;
  counter++;

  return routevalue;
}

function geocode_weather(latitude,longitude) {
  var link = "https://api.weather.com/v1/geocode/" + latitude + "/" + longitude + "/forecast/daily/10day.json?apiKey=626505b9091f4982a505b9091f798235&units=m";
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET",link,false);
  Httpreq.send(null);
  var obj_text = Httpreq.responseText;
  var obj_json = JSON.parse(obj_text);

  /*
   var day = date.slice(0,2);
   var month = date.slice(3,5);
   var year = date.slice(6,10);

   var date_string = year + "-" + month + "-" + day;

   console.log(date_string);

   for (i in obj_json.forecasts) {
   document.write(obj_json.forecasts[i].fcst_valid_local);
   }
   */
  if (obj_json.forecasts[0].day) {
    var prob = obj_json.forecasts[0].day.pop;
    var precipitation = obj_json.forecasts[0].day.qpf;
  }
  else {
    var prob = obj_json.forecasts[1].day.pop;
    var precipitation = obj_json.forecasts[1].day.qpf;
  }

  return {probability: prob, quantity: precipitation, expectation: prob*precipitation/100};
}

function distanceStuff() {
  console.log('hoi ich bin im distance');

  latLngA = new google.maps.LatLng(startLat,startLng);
  var latLngB = new google.maps.LatLng(destinationLat, destinationLng);
  var distance = google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
  //console.log(distance);

  latLngA = new google.maps.LatLng(startLat,startLng);
  var latLngB = new google.maps.LatLng(destinationLat, startLng);
  var xDistance = google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);

  //console.log(xDistance);

  latLngA = new google.maps.LatLng(startLat,startLng);
  var latLngB = new google.maps.LatLng(startLat, destinationLng);
  var yDistance = google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);

  //console.log(yDistance);

  distanceThreshold = distance/2000;

  latLngC = new google.maps.LatLng((startLat + destinationLat)/2 - 1/111*distanceThreshold/2, (startLng + destinationLng)/2);
  latLngD = new google.maps.LatLng((startLat + destinationLat)/2 + 1/111*distanceThreshold/2, (startLng + destinationLng)/2);
}

function drawMap() {
  directionsRenderer1 = new google.maps.DirectionsRenderer();
    directionsRenderer2 = new google.maps.DirectionsRenderer();
    directionsRenderer3 = new google.maps.DirectionsRenderer();

  function requestDirections(startLat,startLng,destinationLat,destinationLng, wegPunkt, callback) {
    var directionsService = new google.maps.DirectionsService();

    directionsService.route({
      origin: new google.maps.LatLng(startLat,startLng),
      destination: new google.maps.LatLng(destinationLat,destinationLng),
      waypoints: [
        {
          location: wegPunkt,
          stopover: false
        }
      ],
      optimizeWaypoints: true,
      travelMode: document.getElementById('transport').value
    }, callback);
  }

  var onChangeHandler = function() {
    var polylineOptionsActual = {
      strokeColor: '#459294',
      strokeOpacity: 1.0,
      strokeWeight: 10
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route({
      origin: new google.maps.LatLng(startLat,startLng),
      destination: new google.maps.LatLng(destinationLat,destinationLng),
      travelMode: document.getElementById('transport').value
    }, function(result) {
      routeValueA = getTheWayPoints(result);
      resulti[0] = result;
      requestDirections(startLat,startLng,destinationLat,destinationLng, latLngC, function(result){
        resulti[1] = result;
        routeValueB = getTheWayPoints(result);
        if(readyRender==true){
          renderDirections();
        }
        else{
          readyRender = true;
        }
      });
      requestDirections(startLat,startLng,destinationLat,destinationLng, latLngD, function(result){
        resulti[2] = result;
        routeValueC = getTheWayPoints(result);
        if(readyRender==true){
          renderDirections();
        }
        else{
          readyRender = true;
        }
      });
    });
  };
  document.getElementById('submit').addEventListener('click', onChangeHandler);
}

var polylineHighlight = {strokeColor: '#427af4',strokeOpacity: 1.0,strokeWeight: 10};
var polylineLowlight = {strokeColor: '#427af4',strokeOpacity: 0.3,strokeWeight: 7};



function renderDirections() {

    directionsRenderer1.set('directions',null);
    directionsRenderer2.set('directions',null);
    directionsRenderer3.set('directions',null);

    counter = 0;

    readyRender = false;
    var polyline = {polylineLowlight,polylineLowlight,polylineLowlight};

    polyline[highlight] = polylineHighlight;

    directionsRenderer1.setOptions({suppressMarkers: true, polylineOptions: polyline[0]});
    directionsRenderer1.setMap(map);
    directionsRenderer1.setDirections(resulti[0]);

    directionsRenderer2.setOptions({suppressMarkers: true, polylineOptions: polyline[1]});
    directionsRenderer2.setMap(map);
    directionsRenderer2.setDirections(resulti[1]);

    directionsRenderer3.setOptions({suppressMarkers: true, polylineOptions: polyline[2]});
    directionsRenderer3.setMap(map);
    directionsRenderer3.setDirections(resulti[2]);


    var routeArray = {routeValueA, routeValueB, routeValueC};
    beschti = indexOfMin(routeArray);
}

$( document ).ready(function() {
  $("#route1").mouseover(function() {
    highlight = 0;
    renderDirections();
  });
  $("#route2").mouseover(function() {
    highlight = 1;
    console.log("rout1");
    renderDirections();
  });
  $("#route3").mouseover(function() {
    highlight = 2;
    renderDirections();
  });

  $("#route1").	click(function() {
    active = 0;
    $(".vertical-menu a").removeClass('active');
    $("#route1").addClass('active');
    console.log(routeValueA);
    preisli(routeValueA);
    $("#erwartigswert").html('Erwarteter Regen: ' + extround(routeValueA/weatherPointsA,1)+'mm');
  });
  $("#route2").	click(function() {
    active = 1;
    $(".vertical-menu a").removeClass('active');
    $("#route2").addClass('active');
    preisli(routeValueB);
    $("#erwartigswert").html('Erwarteter Regen: ' + extround(routeValueB/weatherPointsB,1)+'mm');
  });
  $("#route3").	click(function() {
    active = 2;
    $(".vertical-menu a").removeClass('active');
    $("#route3").addClass('active');
    preisli(routeValueC);
    $("#erwartigswert").html('Erwarteter Regen: ' + extround(routeValueC/weatherPointsC,1)+'mm');
  });
});

function preisli(value){
  $("#preis1").html(extround(3*value,1)+'.-');
    $("#preis2").html(extround(5*value,1)+'.-');
    $("#preis3").html(extround(7*value,1)+'.-');
}

  var routeArray = {routeValueA, routeValueB, routeValueC};
  beschti = indexOfMin(routeArray);

function indexOfMin(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var min = arr[0];
  var minIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }

  return minIndex;
}

function extround(zahl,n_stelle) {
    zahl = (Math.round(zahl * n_stelle) / n_stelle);
    return zahl;
}
