function getImageLightness(imageSrc, callback) {
	var img = document.createElement("img");
	img.src = imageSrc;
	img.style.display = "none";
	document.body.appendChild(img);

	var colorSum = 0;

	img.onload = function () {
		// create canvas
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(this, 0, 0);

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var r, g, b, avg;

		for (var x = 0, len = data.length; x < len; x += 4) {
			r = data[x];
			g = data[x + 1];
			b = data[x + 2];

			avg = Math.floor((r + g + b) / 3);
			colorSum += avg;
		}

		var brightness = Math.floor(colorSum / (this.width * this.height));
		callback(brightness);
	};
}

async function setBackgroundImage(image_url) {
	const x = document.body.style;
	x.backgroundImage = `url(${image_url})`;
}

async function getBackgroundImage() {
	const url = "https://api.pexels.com/v1/search?query=wallpaper&per_page=50";
	const api_token =
		"563492ad6f917000010000016829060a13e4449c835a48506319b68b";
	try {
		const promise = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: api_token,
			},
		});
		const data = await promise.json();
		let random = Math.floor(Math.random() * 49 + 0);
		const image_url = data["photos"][random]["src"]["landscape"];
		await setBackgroundImage(image_url);
	} catch {
		console.log(
			"exceeded api call limit, default background has been applied"
		);
		await setBackgroundImage("/img/bg.jpg");
	}
}

function setIntervalAndExecute(fn, t) {
	fn();
	return setInterval(fn, t);
}

//setIntervalAndExecute(getBackgroundImage, 60000);
getBackgroundImage();