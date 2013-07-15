var world;

function createEnvironment(){
	world = new Kinetic.Stage({
		container: 'world-container',
		width: $(window).width(),
		height: $(window).height()
	});
	
	var environment = new Kinetic.Layer();
	
	var area = new Kinetic.Rect({
		x: 0,
        y: 0,
//        fill:"#111"
//        fillLinearGradientStartPoint: [$(window).width()/2, 0],
//        fillLinearGradientEndPoint: [$(window).width()/2, $(window).height()/2],
//        fillLinearGradientColorStops: [0, '#000', 1, '#555'],
        width: $(window).width(),
        height: $(window).height()
	});
	
	environment.add(area);
	world.add(environment);
	
	var position = new Point(world.getWidth()/2, world.getHeight()/2);
	createCar(position);
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

function createCar(position){
	var car = new Kinetic.Wedge({
		x: position.x,
        y: position.y,
        radius: 50,
        angleDeg: 30,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2
	});
	
	var carLayer = new Kinetic.Layer();
	carLayer.add(car);
	world.add(carLayer);
}

$(document).ready(function(){
	createEnvironment();
})