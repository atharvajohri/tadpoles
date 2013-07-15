var world;
var arenaLayer, anim;

function createEnvironment(){
	world = new Kinetic.Stage({
		container: 'world-container',
		width: $(window).width(),
		height: $(window).height()
	});
	
	arenaLayer = new Kinetic.Layer();
	
	var wedge = new Kinetic.Wedge({
        x: 600,
        y: 400,
        radius: 50,
        angleDeg: 360,
        fill: 'blue',
        rotationDeg: -120
    });

	setmd(wedge);
	
	arenaLayer.add(wedge);

	world.add(arenaLayer);
}

function setmd(wedge){
	wedge.on("mousedown", function(){
		//start anim
		wedge.off("mousedown");
		setAnim(wedge);
		console.log('starting ---->')
		wedge.setAngleDeg(0);
		anim.start();
		startTimer();
	})
}

var timer;

function startTimer(){
	time = 0;
	timer = setInterval(function(){
		time = (time+1);
		$("#timer").html(time.toFixed(2));
	}, 1000)
}

/*
 * 17ms = 1 frame
 * 
 * 360d = 10s
 * 1s = 36d
 * 1000ms = 36d
 * 1ms = 0.036d
 * 17
 * 
 * 
 */

function getAngleChange(length, fps){
	return (360/(length*1000))*fps
}

function setAnim(wedge){
	anim = new Kinetic.Animation(function(frame){
		console.log(frame.timeDiff)
		
		wedge.setAngleDeg(wedge.getAngleDeg()+getAngleChange(250, frame.timeDiff));
		if (wedge.getAngleDeg()>360){
			anim.stop();
			setmd(wedge);
			clearInterval(timer);
		}
	}, arenaLayer);
}

$(document).ready(function(){
	createEnvironment();
})