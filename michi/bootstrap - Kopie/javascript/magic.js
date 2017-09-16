function initialize() {
    drawMap();
}
var map;

function drawMap() {
    console.log("drawMap");
        var directionDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;

    var start = new google.maps.LatLng(47,8);
    var myOptions = {
      zoom:7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: start
    }
    map = new google.maps.Map(document.getElementById('map'), myOptions);

    function renderDirections(result) { 
        var directionsRenderer = new google.maps.DirectionsRenderer(); 
        directionsRenderer.setMap(map); 
        directionsRenderer.setDirections(result); 
      }     

    function requestDirections(startn,starto,endn,endo) {
      console.log("request");
      directionsService.route({ 
        origin: new google.maps.LatLng(startn,starto), 
        destination: new google.maps.LatLng(endn,endo), 
        travelMode: google.maps.DirectionsTravelMode.DRIVING 
      }, function(result) { 
        renderDirections(result); 
      }); 
    } 

    requestDirections(47,8.5,47,8); 
    requestDirections(47.1,8.1,47,8.3);  
    console.log("enddraw");
  }