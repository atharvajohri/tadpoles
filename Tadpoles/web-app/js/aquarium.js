var world, fishes = [];

function createEnvironment(){
	world = new Kinetic.Stage({
		container: 'world-container',
		width: $(window).width(),
		height: $(window).height()
	});
	
	var environment = new Kinetic.Layer();
	
	var water = new Kinetic.Rect({
		x: 0,
        y: 0,
        opacity:0.3,
        fillLinearGradientStartPoint: [$(window).width()/2, 0],
        fillLinearGradientEndPoint: [$(window).width()/2, $(window).height()/2],
        fillLinearGradientColorStops: [0, '#61afed', 1, 'blue'],
        width: $(window).width(),
        height: $(window).height()
	});
	
	environment.add(water);
	world.add(environment);
	created= true;
	
	setFishTriggers();
	
	createFish(new Point($(window).width()/2, $(window).height()/2));
}

function toDegrees (angle) {
	return angle * (180 / Math.PI);
}

function toRadians (angle) {
	return angle * (Math.PI / 180);
}

function calculateRotationAngle(fp, mp, rad){
	var ratio = (fp.y - mp.y)/(mp.x - fp.x);
	var angle = toDegrees(Math.atan(ratio));
	
	if (mp.y < fp.y && angle < 0){ //2nd quadrant
		angle = 180 + Math.abs(angle);
	}else if(mp.y > fp.y && angle > 0){ //3rd quad 
		angle = 180 - angle;
	}else if(mp.y > fp.y && angle <0){ //4th
		angle = Math.abs(angle);
	}else{ // 1st
		angle = 360 - Math.abs(angle);
	}
	
	return angle;
}


function setFishTriggers(fish){
	if (fish){
		console.log(fish);
		world.on('mousemove', function(evt){
			var mp = world.getMousePosition();
			var cp = new Point(mp.x, mp.y);
			var angle = calculateRotationAngle(fish.position, cp);
			rotateFish(fish, angle);
			swimAnimate(fish);
		});
		
//		world.on('click', function(evt){
//			var mp = world.getMousePosition();
//			var cp = new Point(mp.x, mp.y);
//			moveFish(fish, cp);
//			swimAnimate(fish);
//		});
	}
}

function Fish(id, shape, position, layer, anims){
	this.id= id;
	this.shape = shape;
	this.position = position;
	this.layer = layer;
	this.anims = anims;
}

function Shape(head, tail){
	this.head = head;
	this.tail = tail;
}

function Animations(swim, rotate, move){
	this.swim = swim;
	this.rotate = rotate;
	this.move =move;
}

function Point(x, y){
	this.x = x;
	this.y = y;
}

function getHeadPoints(position, scale){
	if (!scale)
		scale = 10
	var x = position.x;
	var y = position.y;
	var points = [];
	var p1 = {'x':x+scale, 'y':y};
	var p2 = {'x':x, 'y':y-(2/5)*scale};
	var p3 = {'x':x-(4/5)*scale, 'y':y};
	var p4 = {'x':x, 'y':y+(2/5)*scale};
	points.push(p1);
	points.push(p2);
	points.push(p3);
	points.push(p4);
	
	return points;
}

function getTailPoints(attachPoint, tlen, diff){
	if (!diff)
		diff=15
	if (!tlen)
		tlen = 15;
	var tPoints = [];
	var x = attachPoint.x;
	for (var i=0;i<tlen;i++){
		tPoints.push({'x':x, 'y':attachPoint.y});
		x-=diff;
	}
	
	return tPoints;
}

function createFish(position){
	var hPoints = getHeadPoints(position, 35);
	var fHead = new Kinetic.Blob({
		x:position.x,
		y:position.y,
		points:hPoints,
		fillLinearGradientStartPoint: [hPoints[2].x, hPoints[2].y],
        fillLinearGradientEndPoint: [hPoints[0].x, hPoints[0].y],
        fillLinearGradientColorStops: [0, '#000', 1, '#555'],
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
		tension:0.5,
		offset: [position.x, position.y]
	});
	
	
	var tPoints = getTailPoints(hPoints[2]);
	var fTail= new Kinetic.Spline({
		x:position.x,
		y:position.y,
		points:tPoints,
		stroke:'#222',
		strokeWidth:2,
		lineCap: 'round',
		tension:0.5,
		offset:[position.x, position.y]
	});
	
	var fShape = new Shape(fHead, fTail);
	
	var fLayer = new Kinetic.Layer();
	fLayer.add(fHead);
	fLayer.add(fTail);
	
	var fish = new Fish(12, fShape, position, fLayer, new Animations());
	fishes.push(fish);
	world.add(fLayer);
	
	setFishTriggers(fish);
}


function swimAnimate(fish){
	if (fish.anims.swim)
		fish.anims.swim.stop()
	
	fish.anims.swim = new Kinetic.Animation(function(frame) {
		var cp = fish.shape.tail.getPoints();
        var np = [];
        for (var i=1;i<cp.length;i++){
        	var x = cp[i].x;
        	var y = cp[i].y;
        	y = y + Math.cos(frame.time/120 + 10*x);
        	
        	np.push({'x':x, 'y':y})
        }
        
        np.unshift(cp[0]);
        np = np.slice(0,cp.length);
        
        if (np.length == 1){
        	fish.anims.swim.stop();
        }else{
        	fish.shape.tail.setPoints(np);        	        	
        }
        
	}, fish.layer);
	
	fish.anims.swim.start();
}


function moveFish(fish, toPoint){
	if (fish.anims.move)
		fish.anims.move.stop()
	
	fish.anims.move = new Kinetic.Animation(function(frame) {
		var cpx = fish.shape.head.getX();
		var cpy = fish.shape.head.getY();
		
        if (cpx != toPoint.x && cpy != toPoint.y){
      		tp_unlocked = false;
       		fish.shape.head.setX(toPoint.x);
       		fish.shape.head.setX(toPoint.y);
        }else{
        	fish.anims.move.stop();
        	fish.anims.swim.stop();
        }
	}, fish.layer);
	
	fish.anims.move.start();
}


var rotateLock = false, rotateInterval;


function rotateFish(fish, angle){
	rotateInterval = setInterval(function(){
		rotateInterval = true;
	}, 500)
	if (fish.anims.rotate)
		fish.anims.rotate.stop();
	
	angle = Math.floor(angle);
	var initAngle = fish.shape.head.getRotationDeg() % 360;
	
	fish.anims.rotate = new Kinetic.Animation(function(frame) {
		if (!rotateLock && (Math.abs(angle - initAngle)>10)){
			var ca = fish.shape.head.getRotationDeg() % 360;
			if (ca < 0){
				ca = 360 + ca;
			}
			var checkAngle = angle - initAngle;
			if (checkAngle < 0)
				checkAngle = 360 + checkAngle;
			if ((checkAngle) > 180){
				ca = ca - 2;
			}
			else{
				ca = ca + 2;
			}
			fish.shape.head.setRotationDeg(ca);
			fish.shape.tail.setRotationDeg(ca);
			var curAngle = Math.floor(Math.abs(ca));
			if (angle < curAngle+2 && angle < curAngle-2){
//				console.log ("stopped for: " + angle + ", ca -> " + ca)
				fish.anims.rotate.stop();
			}
		}
	}, fish.layer);
	
	fish.anims.rotate.start();
}


$(document).ready(function(){
	createEnvironment();
})