var world;

function createEnvironment(){
	world = new Kinetic.Stage({
		container: 'world-container',
		width: $(window).width(),
		height: $(window).height()
	});
	
	var arenaLayer = new Kinetic.Layer();
	
	var arenaBackdrop = new Kinetic.Rect({
		x: 0,
        y: 0,
//        fill:"#111"
//        fillLinearGradientStartPoint: [$(window).width()/2, 0],
//        fillLinearGradientEndPoint: [$(window).width()/2, $(window).height()/2],
//        fillLinearGradientColorStops: [0, '#000', 1, '#555'],
        width: world.getWidth(),
        height: world.getHeight()
	});
	
	arenaLayer.add(arenaBackdrop);
	world.add(arenaLayer);
	
	
	
	var position = new Point(world.getWidth()/2, world.getHeight()/2);
	createAttacar(position);
}

function toDegrees (angle) {
	return angle * (180 / Math.PI);
}

function toRadians (angle) {
	return angle * (Math.PI / 180);
}

function Point(x, y){
	this.x = x;
	this.y = y;
}

function Movement(u, v, s, a, anim){
	this.u = u;
	this.v = v;
	this.s = s;
	this.a = a;
	this.anim = anim;
}

function Attacar(id, shape, layer, position, movement, locked){
	this.id = id;
	this.shape = shape;
	this.layer = layer;
	this.position = position;
	this.movement = movement;
	this.locked = locked;
}

function createAttacar(position){
	var angle = 30;
	var attacarShape = new Kinetic.Wedge({
		x: position.x,
        y: position.y,
        radius: 50,
        angleDeg: angle,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        rotationDeg: 180-(angle)/2
	});
	
	var attacarLayer = new Kinetic.Layer();
	attacarLayer.add(attacarShape);
	world.add(attacarLayer);
	
	var movement = new Movement();
	
	var attacar = new Attacar(12, attacarShape, attacarLayer, position, movement, false);
	setAttacarTriggers(attacar);
}

function getRotationAngle(attacar, mp){
	var fp = attacar.position;
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
	angle = angle + 180 - attacar.shape.getAngleDeg()/2
	return angle;
}

//function rotateAttacar(attacar, mp){
//	var angle = getRotationAngle(attacar, mp);
//	attacar.shape.setRotationDeg(angle);		
//	attacar.layer.remove();
//	world.add(attacar.layer);
//}

function calculatePositionalChanges(cp, mp){
	var speed = Math.sqrt(Math.pow((mp.x - cp.x), 2) + Math.pow((mp.y - cp.y), 2)) / 50;
	if (speed > 10)
		speed = 10;
	$("#speed").html(speed);
	return speed;
}

function moveAttacar(attacar, mp){
	var acc = 2;
	
	if (attacar.movement.anim)
		attacar.movement.anim.stop();
	
	attacar.movement.anim = new Kinetic.Animation(function(frame){
		
		var angle = getRotationAngle(attacar, mp);
		attacar.shape.setRotationDeg(angle);		
		
		var as = attacar.shape;
		var asX = as.getX();
		var asY = as.getY();
		var asT = as.getRotationDeg() - 180 + as.getAngleDeg()/2;
		$("#ast").html(asT);
		if ((asX > (mp.x - 1) && asX < (mp.x + 1)) && (asY > (mp.y - 1) && asY < (mp.y + 1))){
			//decelerate
		}else{
			var dx=0, dy=0;
			var inc = calculatePositionalChanges(new Point(asX, asY), mp);
			console.log(inc)
			
			if(asT <= 45 || (asT > 315 && asT <= 360) || asT == 0){
				asX += inc;
				dy = inc * Math.tan(toRadians(asT));
				asY += dy;
			}
			else if (asT <= 135){
				asY += inc;
				dx = inc / Math.tan(toRadians(asT));
				asX += dx;
			}else if (asT <= 225){
				asX -= inc;
				dy = inc * Math.tan(toRadians(asT));
				asY -= dy;
			}else if (asT <= 315){
				asY -= inc;
				dx = inc / Math.tan(toRadians(asT));
				asX -= dx;
			}
			
			if (asX < 0){
				asX = 0;
			}else if (asX > world.getWidth()){
				asX = world.getWidth();	
			}
			if (asY < 0){
				asY = 0;
			}else if (asY > world.getHeight()){
				asY = world.getHeight();
			}
			
			attacar.shape.setX(asX);
			attacar.shape.setY(asY);
		}
		
	}, attacar.layer);
	
	attacar.movement.anim.start();
}

function setAttacarTriggers(attacar){
	world.on('mousemove',function(e){
		if (!attacar.locked){
			var mp = world.getMousePosition();
//			rotateAttacar(attacar, mp);
			moveAttacar(attacar, mp);
		}
	});
}

$(document).ready(function(){
	createEnvironment();
})