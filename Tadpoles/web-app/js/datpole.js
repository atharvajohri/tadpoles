var world, tadpoleLayer, tadpoles = []

function Point(x, y){
	this.x = x;
	this.y = y;
}

function Tadpole(shape, speed, posAnim, acceleration, goingTo){
	this.shape = shape;
	this.speed = speed;
	this.posAnim = posAnim;
	this.acceleration = acceleration;
	this.goingTo = goingTo;
}

function createTadpole(mx, my){
	console.log ("creating a tadpole..")
	tadpoleLayer.remove()
	var tadpoleShape = new Kinetic.Circle({
        x: mx,
        y: my,
        radius: 10,
        fill: 'white'
	});
	
	var tadpole = new Tadpole(tadpoleShape, 0, null, 2, null)
	tadpoles.push(tadpole);
	tadpoleLayer.add(tadpoleShape);
	world.add(tadpoleLayer);
}

function customLog(string, clear){
	if (clear)
		$("#log-container").html("");
	$("#log-container").append(string + "<br>");
}

function refreshInfo(){
	var infoString = "<b>Tadpole Stats:</b><br>"
	for(var i=0;i<tadpoles.length;i++){
		infoString += "" + (i+1) + ". Moving: <b>" + tadpoles[i].posAnim.isRunning() + "</b>, Going To: ("+ tadpoles[i].goingTo.x +", " + tadpoles[i].goingTo.y +"), Acceleration: " + tadpoles[i].acceleration + "dx/s<sup>2</sup>, Speed: " + Math.floor(tadpoles[i].speed) + "dx/s <br>" 
	}
	
	$("#info-container").html(infoString)
}

function moveTadpole(tadpole, mx, decelerate){
	var tpShape = tadpole.shape;
	var cx = tpShape.getX();
	var cs = Math.abs(mx - cx);
	
	console.log ("starting: cx " + cx + ", mx : " + mx)
	
	var goingTo = new Point(mx, 0);
	tadpole.goingTo = goingTo;
	
	if (tadpole.posAnim)
		tadpole.posAnim.stop()

	var ct = 0;
	tadpole.posAnim = new Kinetic.Animation(function(frame) {
		var ca = tadpole.acceleration;
		
		var ct = frame.time/1000;
		var cpx = tpShape.getX();
		var npx;
		
		var ck = tadpole.speed * ct + (1/2)*ca*ct*ct;
		npx = cpx + ck;
		tadpole.speed = Math.sqrt(2*ca*ck + tadpole.speed * tadpole.speed)
		tpShape.setX(npx);
		customLog(npx);
		
		if (npx > mx-2){
			console.log ("stopped for good.")
			tadpole.posAnim.stop();
		}else if (cpx >= (cx+cs/2) && decelerate){ //stop anim & decelerat
			tadpole.posAnim.stop();
			tadpole.acceleration = 0;
			customLog ("<-------------------->")
			moveTadpole(tadpole, mx, false)
		}
		refreshInfo();
	}, tadpoleLayer);
	
	tadpole.posAnim.start();
}

function createEnvironment(){
	world = new Kinetic.Stage({
		container: 'world-container',
		width: $(window).width(),
		height: $(window).height()
	});
	
	tadpoleLayer = new Kinetic.Layer();
	
	var pond = new Kinetic.Rect({
		x: 0,
        y: 0,
        fill:'red',
        opacity:0.3,
        width: $(window).width(),
        height: $(window).height()
	});
	
	
	pond.on('click', function() {
        var mousePos = world.getMousePosition();
        if (tadpoleExists){
        	if (tadpoles.length){
        		for (var i=0;i<tadpoles.length;i++){
        			moveTadpole(tadpoles[i], mousePos.x, true);
        		}
        	}
        }
        else{
        	createTadpole(mousePos.x, mousePos.y);
        	tadpoleExists = true;
        }
	});

	tadpoleLayer.add(pond);
	world.add(tadpoleLayer);
}

var tadpoleExists = false;

$(document).ready(function(){
	createEnvironment();
})



/*Unused references
 * curPosX = tpShape.getX();
	curPosY = tpShape.getY();
	
	if (((mx<(curPosX+2)) && (mx >(curPosX-2))) && ((my<(curPosY+2)) && (my >(curPosY-2)))){
		customLog("--- <b> Stopping </b>")
		posAnim.stop();
	}
	
	var newPosX, newPosY;
	
	if (mx>curPosX)
		newPosX = curPosX + speed;
	else
		newPosX = curPosX - speed;
		
	newPosY = Math.floor(tan * (curPosX-cx))+cy 
	
	tpShape.setX(newPosX)
	tpShape.setY(newPosY)
 * 
 * */

