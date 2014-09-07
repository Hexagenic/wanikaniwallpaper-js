define(['settings'], function(settings) {
	'use strict';
	var userData_ = {};
	var characters_ = {};

	return {
		load: function(onComplete) {
			var key = settings.api_key;
			var url = 'https://www.wanikani.com/api/user/' + key + '/kanji?callback=define';
            
			require([url], function(data) {
				if (data.error !== undefined) {
					var messageElem = document.getElementById('message');
					messageElem.innerHTML = "API Error: " + data.error.message;
					return;
				}
				userData_ = data.user_information;

				data.requested_information.forEach(function(character) {
					characters_[character.character] = character;
				});

				onComplete();
			});
		},
		get userData() { return userData_; },
		get characters() { return characters_; }
	};
});
