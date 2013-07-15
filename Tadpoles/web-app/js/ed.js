var canvas, ctx;

function initiateMania() {
	var img = new Image; 
	canvas = document.getElementById("world-container");
	ctx = canvas.getContext("2d");
	var src = "/images/75-5.jpg"; // insert image url here

	img.crossOrigin = "Anonymous";

	img.onload = function() {
//		canvas.width = img.width;
//		canvas.height = img.height;
		ctx.drawImage(img, 0, 0, 100, 100);
		localStorage.setItem("savedImageData", canvas.toDataURL("image/png"));
	}

	img.src = src;
	// make sure the load event fires for cached images too
	if (img.complete || img.complete === undefined) {
		img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		img.src = src;
	}
}

var drawn = false;

$(document).ready(function() {
	initiateMania();
	if (!drawn){
		
	}
});