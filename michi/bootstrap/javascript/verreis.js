$( document ).ready(function() {
    console.log( "ready!" );

    $( "#submit" ).click(function() {
    	var width = $( window ).width();
    	console.log("will animiere!");
  $( ".wrapright" ).animate({
    left: width-60
  }, 800, function() {
    // Animation complete.
  });
});

    $( ".vertical-menu" ).click(function() {
	    var width = $( window ).width();
	    console.log("will animiere!");
	  	$( ".wrapright" ).animate({
	    	left: 0.4*width-60
	  	}, 800, function() {
	    // Animation complete.
	  	});
	});

    $( ".map" ).click(function() {
    	closePramie();
	});

});



function closePramie(){
	var width = $( window ).width();
    	console.log("will animiere!");
  $( ".wrapright" ).animate({
    left: width-60
  }, 800, function() {
    // Animation complete.
  });
}