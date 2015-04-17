define(['settings', 'order'], function(settings, order) {

	var fonts = '"Meiryo","Hiragino Kaku Gothic Pro","ヒラギノ角ゴ Pro W3","メイリオ","Osaka","MS PGothic","ＭＳ Ｐゴシック",sans-serif';

	function getColor(character) {
		if (character === undefined) {
			return settings.colors['unseen'];
		}

		var userData = character.user_specific;
		if (userData === null) {
			return settings.colors['unseen'];
		}

		return settings.colors[userData.srs];
	}

	function findBestFit(width, height, elementsToFit) {
		var sqrt = Math.ceil(Math.sqrt(elementsToFit)) + 1;

		var aspectRatio = width / height;

		var y = Math.ceil(sqrt / ((1 + aspectRatio)/2));
		var x = Math.ceil(elementsToFit / y);

		var charWidth = width / x;
		var charHeight = height / y;
		var fontSize = Math.min(charWidth, charHeight);
		var totalArea = width * height;
		var coveredArea = elementsToFit * Math.pow(fontSize, 2);
		var fit = coveredArea / totalArea;

		return {fit: fit, w: x, h: y, fontSize: fontSize, charWidth: charWidth, charHeight: charHeight};
	}

	return {
		draw: function(characters) {
			var canvasElem = document.createElement('canvas');
			canvasElem.width = settings.width;
			canvasElem.height = settings.height;
			
			var margin = settings.margin;
			var drawWidth = settings.width - margin.left - margin.right;
			var drawHeight = settings.height - margin.top - margin.bottom;
			var aspectRatio = drawWidth / drawHeight;

			var bestFit = findBestFit(drawWidth, drawHeight, order.data.length);
			
			var ctx = canvasElem.getContext('2d');

			ctx.fillStyle = settings.colors.background;
			ctx.fillRect(0, 0, settings.width, settings.height);
			
			ctx.font = '' + Math.floor(bestFit.fontSize) + 'px ' + fonts;
			ctx.textBaseline = 'top';

			var offset = -Math.floor(bestFit.fontSize) * 0.2;
			// needed to perfectly align the text.
			
			var i, x, y, c;
			for (i = 0; i < order.data.length; i++) {
				c = order.data[i];
				ctx.fillStyle = getColor(characters[c]);

				y = margin.top + Math.floor(i / bestFit.w) * bestFit.charHeight + offset;
				x = margin.left + (i % bestFit.w) * bestFit.charWidth;
				ctx.fillText(c, Math.floor(x), Math.floor(y));
			}

			var dataURL = canvasElem.toDataURL('image/png');

			document.getElementsByTagName('body')[0].style['background-image'] = "url(" + dataURL + ")";
			document.getElementsByTagName('body')[0].style['backgroundImage'] = "url(" + dataURL + ")";

			var img = document.createElement('img');
			img.src = dataURL;
			img.width = "100";

			var download_link = document.createElement('a');
			download_link.id = "download_link"
			download_link.href = dataURL;
			download_link.download = "wallpaper.png";
			download_link.innerHTML = "Download";
			download_link.target = "_blank";

			var messageElem = document.getElementById('message');
			messageElem.innerHTML = "";
			messageElem.appendChild(img);
			messageElem.appendChild(download_link);
			messageElem.innerHTML += "<p>Internet explorer users: right click image and save as</p>";
		}
	};
});
