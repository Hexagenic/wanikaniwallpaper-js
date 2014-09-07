define(['settings', 'order'], function(settings, order) {

	var fonts = '"Hiragino Kaku Gothic Pro","Meiryo","ãƒ’ãƒ©ã‚®ãƒŽè§’ã‚´ Pro W3","ãƒ¡ã‚¤ãƒªã‚ª","Osaka","MS PGothic","ï¼­ï¼³ ï¼°ã‚´ã‚·ãƒƒã‚¯",sans-serif';

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

	return {
		draw: function(characters) {
			var canvasElem = document.createElement('canvas');
			canvasElem.width = settings.width;
			canvasElem.height = settings.height;
			
			var margin = settings.margin;
			var drawWidth = settings.width - margin.left - margin.right;
			var drawHeight = settings.height - margin.top - margin.bottom;
			var aspectRatio = drawHeight / drawWidth;

            var w = Math.sqrt(order.data.length / aspectRatio);
			var h = Math.ceil(w * aspectRatio);
			w = Math.ceil(w);
			var size = (aspectRatio < 1) ? (drawWidth / w) : (drawHeight / h);

			var ctx = canvasElem.getContext('2d');

			ctx.fillStyle = settings.colors.background;
			ctx.fillRect(0, 0, settings.width, settings.height);

			
			ctx.font = '' + Math.floor(size) + 'px ' + fonts;
			
			var i, x, y, c;
			for (i = 0; i < order.data.length; i++) {
				c = order.data[i];
				ctx.fillStyle = getColor(characters[c]);
				y = Math.floor(margin.top + size + Math.floor(i / w) * size);
				x = Math.floor(margin.left + (i % w) * size);
				ctx.fillText(c, x, y);
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
