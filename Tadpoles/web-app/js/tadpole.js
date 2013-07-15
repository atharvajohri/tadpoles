var pothole, tadpoleLayer, tadpoles = []

function createEnvironment(){
	pothole = new Kinetic.Stage({
		container : 'pothole-container',
		width : $(window).width(),
		height : $(window).height()
	});
	
	tadpoleLayer = new Kinetic.Layer();	
}

function getTadpolePoints(tpPoints){
	var tadpolePoints = []
	if (!tpPoints)
		tpPoints = 4
	for (var i=0;i<tpPoints;i++){
		var tpx = Math.floor(Math.random()*500)
		var tpy = Math.floor(Math.random()*500)
		tadpolePoints.push({x:tpx, y:tpy})
	}
	return tadpolePoints
}

function createTadpole(tpPoints, color, tension, customPoints, push, opacity, mx, my){
	if (!color)
		color = "#61afed"
	if (!opacity)
		opacity = 0.5
	if (!tension)
		tension = 0.5
	if (!customPoints)
		customPoints = getTadpolePoints(tpPoints)
	if (!mx)
		mx = $(window).width()/2-250
	if (!my)
		my = $(window).height()/2-250
	var tadpole = new Kinetic.Blob({
		points : customPoints,
		fill : color,
		tension : tension,
		opacity:opacity,
		x:mx,
		y:my
	});
	tadpoleLayer.add(tadpole);
	if (!push)
		tadpoles.push(tadpole);
	return tadpole
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function createAndAnimateTadpole(mx, my){
	var curTadpole = createTadpole(Math.floor(Math.random()*8), getRandomColor(), false, false, false, (Math.random()*0.5 + 0.4), mx, my);
	animateTadpole(curTadpole)
}

function animateTadpole(tadpole){
	var finalPoints = getTadpolePoints(tadpole.getPoints().length);
//	createTadpole(false, false, false, finalPoints, true)
	var duration =3000, speed=200;
	var shapeAnim = new Kinetic.Animation(function(frame) {
		if (frame.time > duration){
			shapeAnim.stop()
			animateTadpole(tadpole)
			console.log("starting new shapeanim")
		}else{
			var currentPoints = tadpole.getPoints();
			var newPoints = []
			for (var i=0;i<currentPoints.length;i++){
				var curX = currentPoints[i].x
				var curY = currentPoints[i].y
				var finX = finalPoints[i].x
				var finY = finalPoints[i].y
//				console.log ("curx:" + curX + ", curY:" + curY + " -------- finX: " +finX+", finY:"+finY)
				var newX=0.1, newY=0.1
				if (curX != finX && curY != finY){
//					newX = Math.abs((finX-curX)/speed)
//					newY = Math.abs((finY-curY)/speed)
					
					if (finX>curX)
						newX = curX + newX
					else
						newX = curX - newX
						
					if (finY>curY)
						newY = curY + newY
					else
						newY = curY - newY
				}else{
//					shapeAnim.stop()
//					animateTadpole(tadpole)
//					console.log("starting new!")
				}
				newPoints.push({x:newX, y:newY})
			}
			tadpole.setPoints(newPoints)
//			var flip = parseInt(Math.random() * 2, 10);
//			var newTension = 0.5
//			if (flip)
//				newTension = tadpole.getTension() + 0.01
//			else
//				newTension = tadpole.getTension() - 0.01
//			tadpole.setTension(newTension)
		}
	}, tadpoleLayer);
	shapeAnim.start();
	
	var finalPosX = Math.floor(Math.random()*$(window).width())
	var finalPosY = Math.floor(Math.random()*$(window).height())
	var shapeDuration = 5500
	var posAnim = new Kinetic.Animation(function(frame) {
//		if (frame.time > shapeDuration){
//			posAnim.stop()
//			animateTadpole(tadpole)
//			console.log("starting new posanim")
//		}else{
			curPosX = tadpole.getX()
			curPosY = tadpole.getY()
			
			var newPosX = 0.2, newPosY = 0.2
			if (finalPosX>curPosX)
				newPosX = curPosX + newPosX
			else
				newPosX = curPosX - newPosX
				
			if (finalPosY>curPosY)
				newPosY = curPosY + newPosY
			else
				newPosY = curPosY - newPosY
				
			tadpole.setX(newPosX)
			tadpole.setY(newPosY)
//		}
	}, tadpoleLayer);
	posAnim.start();
}

$(document).ready(function(){
	createEnvironment();
	createTadpole(5, "#ff0000", 0.5);
	pothole.add(tadpoleLayer);
	for (var i=0;i<tadpoles.length;i++){
		animateTadpole(tadpoles[i])
	}
	
	$(document).click(function(e){
		createAndAnimateTadpole(e.pageX, e.pageY)
	})
})