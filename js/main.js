require(["api", "canvasdrawer", "settings"], function(api, canvasDrawer, settings) {
	var form = document.getElementById("api-form");

	function makeRequest() {
		var messageElem = document.getElementById('message');
		messageElem.innerHTML = "Loading...";
		api.load(function() {

			canvasDrawer.draw(api.characters);

		});
		return false;
	}

	form.onsubmit = makeRequest;
	
	if (settings.api_key) {
		makeRequest();
	}
	
});
