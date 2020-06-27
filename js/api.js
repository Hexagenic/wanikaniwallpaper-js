define(['settings'], function(settings) {
	'use strict';
	var characters_ = {};

	async function fetchApiData(defaultApiEndpointPath, dataFunction)
	{
		var defaultApiURL = 'https://api.wanikani.com/v2/' + defaultApiEndpointPath;
		var apiToken = settings.api_key;
		var requestHeaders =
		new Headers({
			Authorization: 'Bearer ' + apiToken,
		});

		var response;
		while (response === undefined || response.pages.next_url !== null)
		{
			var apiEndpoint =
			new Request(response === undefined ? defaultApiURL : response.pages.next_url, {
				method: 'GET',
				headers: requestHeaders
			});

			response = await fetch(apiEndpoint).then(response => response.json());

			if (response.error !== undefined)
			{
				var messageElem = document.getElementById('message');
				messageElem.innerHTML = "API Error: " + response.code + " " + response.error;
				return false;
			}

			response.data.forEach(dataFunction);
		}

		return true;
	}

	return {
		load: async function(onComplete) {

			// First grab all of user's SRS stage data
			var userSRS = {};
			var success = await fetchApiData('assignments?subject_types=kanji&started=true', function(assignment) {
				userSRS[assignment.data.subject_id] = assignment.data.srs_stage;
			});

			// Then grab the kanji character associated for each SRS stage we have data for.
			if (success)
			{
				success = await fetchApiData('subjects?types=kanji', function(kanji) {
					characters_[kanji.data.characters] = userSRS[kanji.id];
				});
			}

			if (success) onComplete();
		},
		get characters() { return characters_; }
	};
});
