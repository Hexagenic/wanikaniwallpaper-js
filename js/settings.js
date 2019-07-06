define(function() {
	var SETTINGS_KEY = 'wkw_settings';

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

	function writeSettings() {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings_));
	}

	// Support reading settings from the old settings store.
	// This can be dropped a year from merge without user impact.
	function readSettingsFromCookie() {
		return document.cookie.split(';').map(function(cookie) {
			var cookieParts = cookie.split('=').map(function(s) { return s.trim(); });
			var key = cookieParts[0];
			var value = cookieParts[1];
			return {key: key, value: value};
		}).filter(function(kvp) {
			return kvp.key === SETTINGS_KEY;
		}).map(function(kvp) {
			var value = JSON.parse(window.atob(kvp.value));
			// Lazily migrate users with settings stored in cookies
			// to localStorage immediately upon read and clear the
			// cookie in the process.
			settings_ = value;
			writeSettings(value);
			document.cookie = SETTINGS_KEY + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			return value;
		})[0];
	}

	function readSettingsFromStorage() {
		var fromStorage = localStorage.getItem(SETTINGS_KEY);
		if (fromStorage) {
			var value = JSON.parse(fromStorage);
			settings_ = value;
			return value;
		}
	}

	function readSettings() {
		readSettingsFromStorage() || readSettingsFromCookie();
	}

	function read(property) {
		if (settings_[property] === undefined) {
			settings_[property] = defaults_[property];
			writeSettings();
		}
		return settings_[property];
	}

	function write(property, value) {
		settings_[property] = value;
		writeSettings();
	}

	readSettings();

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
			writeSettings();
		}
	}

	function connectColorField(fieldName, proprtyName) {
		var elem = document.getElementById(fieldName);
		elem.value = read('colors')[proprtyName];
		elem.oninput = function() {
			settings_.colors[proprtyName] = elem.value;
			writeSettings();
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
