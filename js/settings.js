define(function() {
	var defaults_ = {
		api_key: '',
		width: screen.width,
		height: screen.height,
		margin: {
			top: 30,
			bottom: 30,
			left: 30,
			right: 30
		},
		colors: {
			background: '#000000',
			unseen: '#303030',
			apprentice: '#DD0093',
			guru: '#882D9E',
			master: '#294DDB',
			enlighten: '#0093DD',
			burned: '#FFFFFF'
		}
	};
	var settings_ = {};

    function writeCookie() {
		var variable = 'wkw_settings=' + window.btoa(JSON.stringify(settings_));
		var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
		var expires = 'expires=' + date.toGMTString();
		document.cookie = variable + ';' + expires;
	}

	function readCookie() {
		document.cookie.split(';').forEach(function(cookie) {
			var cookieParts = cookie.split('=');
			var key = cookieParts[0];
			var value = cookieParts[1];
			if (key === 'wkw_settings') {
				settings_ = JSON.parse(window.atob(value));
				return;
			}
		});
	}

	function read(property) {
		if (settings_[property] === undefined) {
			settings_[property] = defaults_[property];
			writeCookie();
		}
		return settings_[property];
	}

	function write(property, value) {
		settings_[property] = value;
		writeCookie();
	}

	readCookie();

	function connectFormField(fieldName, proprtyName) {
		var elem = document.getElementById(fieldName);
		elem.value = read(proprtyName);
		elem.oninput = function() {
			write(proprtyName, elem.value);
		}
	}

	function connectMarginField(fieldName, proprtyName) {
		var elem = document.getElementById(fieldName);
		elem.value = read('margin')[proprtyName];
		elem.oninput = function() {
			settings_.margin[proprtyName] = parseInt(elem.value);
			writeCookie();
		}
	}

	function connectColorField(fieldName, proprtyName) {
		var elem = document.getElementById(fieldName);
		elem.value = read('colors')[proprtyName];
		elem.oninput = function() {
			settings_.colors[proprtyName] = elem.value;
			writeCookie();
		}
	}

	connectFormField('form-apikey', 'api_key');
	connectFormField('form-width', 'width');
	connectFormField('form-height', 'height');

	connectMarginField('form-margin-top', 'top');
	connectMarginField('form-margin-bottom', 'bottom');
	connectMarginField('form-margin-left', 'left');
	connectMarginField('form-margin-right', 'right');

	connectColorField('form-color-background', 'background');
	connectColorField('form-color-unseen', 'unseen');
	connectColorField('form-color-apprentice', 'apprentice');
	connectColorField('form-color-guru', 'guru');
	connectColorField('form-color-master', 'master');
	connectColorField('form-color-enlighten', 'enlighten');
	connectColorField('form-color-burned', 'burned');

	return {
		get api_key() { return read('api_key'); },
		get width() { return read('width'); },
		get height() { return read('height'); },
		get margin() { return read('margin'); },
		get colors() { return read('colors'); }
	};
});
