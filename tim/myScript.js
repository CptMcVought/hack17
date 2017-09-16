function geocode_weather(latitude,longitude) {
	var link = "https://api.weather.com/v1/geocode/" + latitude + "/" + longitude + "/forecast/daily/3day.json?apiKey=626505b9091f4982a505b9091f798235&units=m"
	var Httpreq = new XMLHttpRequest();
	Httpreq.open("GET",link,false);
	Httpreq.send(null);
	obj_text = Httpreq.responseText;
	obj_json = JSON.parse(obj_text);

	var prob = obj_json.forecasts[0].day.pop;
	var precipitation = obj_json.forecasts[0].day.qpf

	return prob*precipitation/100;
}