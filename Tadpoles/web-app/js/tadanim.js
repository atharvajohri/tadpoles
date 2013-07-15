var world, tadpole;

function createEnvironment(){
	world = new Kinetic.Stage({
		container: 'world-container',
		width: $(window).width(),
		height: $(window).height()
	});
	
	var environment = new Kinetic.Layer();
	
	pond = new Kinetic.Rect({
		x: 0,
        y: 0,
        fill:'#61afed',
        opacity:0.3,
        width: $(window).width(),
        height: $(window).height()
	});
	
	environment.add(pond);
	world.add(environment);
	created= true;
	
	createTadpole();
}

var tlen=50;

function initTpPoints(){
	
	var x = 0;
	var y = 450;
	var points = [];
	
	for (var i=0;i<tlen;i++){
		x += 40;
		points.push({'x':x, 'y':y});
	}
	
	return points;
}


function createTadpole(){
	
	var tpPoints = initTpPoints();
	
	var tadpoleShape = new Kinetic.Spline({
		points:tpPoints,
        stroke: 'black',
        strokeWidth: 2,
        lineCap: 'round',
        tension: 0.5
    });
	
	var tadpoleLayer = new Kinetic.Layer();
	tadpoleLayer.add(tadpoleShape);
	world.add(tadpoleLayer);
	
	startTadpoleAnimation(tadpoleShape, tadpoleLayer);
	
}

var tlInterval, tp_unlocked=true;

function startTadpoleAnimation(ts, tl){
	
	tlInterval = setInterval(function(){
		tp_unlocked = true;
	},100);
	
	var swimAnim = new Kinetic.Animation(function(frame) {
		var cp = ts.getPoints();
        var np = [];
        for (var i=0;i<cp.length;i++){
        	var x = cp[i].x;
        	var y = cp[i].y;
        	y = y + Math.cos(frame.time/100 + 10*x);
        	
        	np.push({'x':x, 'y':y})
        }
//        if (tp_unlocked){
//			np.push({});
//			tp_unlocked = false;
//			np = np.slice(1,np.length)
//		}
        
        np = np.slice(0,tlen);
        
        if (np.length == 1){
        	swimAnim.stop();
        }else{
        	ts.setPoints(np);        	        	
        }
        
	}, tl);
	
	var oldPoint = {'x':0, 'y':0};
	
	var movAnim = new Kinetic.Animation(function(frame) {
		var cp = ts.getPoints();
        
        var mp = world.getMousePosition();
        cp = cp.slice(1,tlen);
        if (mp && oldPoint.x != mp.x && oldPoint.y != mp.y){
//        	if (tp_unlocked){
        		
        		cp.push({'x':mp.x, 'y':mp.y})
//            	cp = cp.slice(1,tlen);
        		tp_unlocked = false;
        		oldPoint.x = mp.x;
        		oldPoint.y = mp.y;
        		ts.setPoints(cp);
//        	}
        }
        
	}, tl	);
	

//	movAnim.start();
	swimAnim.start();
	
}





$(document).ready(function(){
	createEnvironment();
})