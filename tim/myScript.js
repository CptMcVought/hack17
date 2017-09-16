function geocode_weather(latitude,longitude) {
	var link = "https://api.weather.com/v1/geocode/" + latitude + "/" + longitude + "/forecast/daily/10day.json?apiKey=626505b9091f4982a505b9091f798235&units=m";
	console.log(link);
	var Httpreq = new XMLHttpRequest();
	Httpreq.open("GET",link,false);
	Httpreq.send(null);
	obj_text = Httpreq.responseText;
	obj_json = JSON.parse(obj_text);

	/*var day = date.slice(0,2);
	var month = date.slice(3,5);
	var year = date.slice(6,10);

	var date_string = year + "-" + month + "-" + day;

	console.log(date_string);

	for (i in obj_json.forecasts) {
		document.write(obj_json.forecasts[i].fcst_valid_local);
	}
	*/
	var prob = obj_json.forecasts[0].day.pop;
	var precipitation = obj_json.forecasts[0].day.qpf;

	return prob*precipitation/100;
}
