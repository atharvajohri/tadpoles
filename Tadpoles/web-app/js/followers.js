var world, pond, slen=10, cp, splines = [], splineId, setSpline=false, shownExistence=false, reconnectLocked = true;

function Point(x, y){
	this.x = x;
	this.y = y;
}


function Spline(id, shape, oldPoint, movAnim, currentPoints, splineLayer){
	this.id = id;
	this.shape = shape;
	this.oldPoint = oldPoint;
	this.movAnim = movAnim;
	this.currentPoints = currentPoints;
	this.splineLayer = splineLayer;
}


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
        fill:'red',
        opacity:0.3,
        width: $(window).width(),
        height: $(window).height()
	});
	
	environment.add(pond);
	world.add(environment);
	created= true;
	readyRelay();
}

var subSocket;

function broadcastFollower(points){
	var pointString = JSON.stringify(points.splice(points.length-slen, points.length));
	subSocket.push(pointString)
//	console.log(pointString)
}


function refreshSplines(){
	var splineHtml = "";
	for (var i=0;i<splines.length;i++){
		splineHtml += "<tr class='spline-row'><td><b>"+splines[i].id+"</b></td><td>"+splines[i].shape.attrs.stroke+"</td><td><div class='spline-color' style='background:"+splines[i].shape.attrs.stroke+"'></div></td>"
		if (splines[i].movAnim){
			if (splines[i].movAnim.isRunning()){
				splineHtml += "<td>Running</td>"
			}else {
				splineHtml += "<td>Not Running</td>"
			}
		}else{
			splineHtml += "<td>Not instantitated</td>"
		}
		splineHtml += "</tr>"
	}
	$("#spline-tracker table").html(splineHtml)
}

function showSplineExistence(){
	console.log ("showing spline existence...")
	for (var i=0;i<splines.length;i++){
		if (splines[i].id == splineId){
			var esJSON = {id:splineId, color:splines[i].shape.attrs.stroke, oldPoint: {x:Math.floor(splines[i].oldPoint.x), y:Math.floor(splines[i].oldPoint.y)}}
			console.log("existing json");
			esJSON = JSON.stringify(esJSON);
			subSocket.push("existingSpline"+esJSON);
		}
	}
}


function createSpline(msgJSON){
	console.log ("Trying to create a new spline: " + msgJSON.id);
	var exists = false;
	for (var i=0;i<splines.length;i++){
		if (splines[i].id.toString() == msgJSON.id.toString()){
			exists = true;
			break;
		}
	}
	
	if (!exists){
		var oldPoint;
		if (msgJSON.oldPoint){
			oldPoint = new Point(msgJSON.oldPoint.x, msgJSON.oldPoint.y);
		}else{
			oldPoint = new Point(Math.floor(Math.random()*$(window).width()), Math.floor(Math.random()*$(window).height()));
		}
		var splineShape = new Kinetic.Spline({
			points:[{x:oldPoint.x, y:oldPoint.y}],//,{x:100, y:100}],
	        stroke: msgJSON.color,
	        strokeWidth: 5,
	        lineCap: 'round',
	        tension: 0.5
	    });
		
		var splineLayer = new Kinetic.Layer();
		splineLayer.add(splineShape);
		world.add(splineLayer);
		
		var cp = [{x:oldPoint.x, y:oldPoint.y}];
		var spline = new Spline(msgJSON.id, splineShape, oldPoint, null, cp, splineLayer);
		if (!splineId && setSpline){
			splineId = msgJSON.id;
			setSpline = false;
			activateSpline(spline); 
		}
		splines.push(spline);
		openAnimation(spline);
		console.log ("Spline " + spline.id + " added.")
		if (splineId && splineId != spline.id){
			showSplineExistence();
//			shownExistence = true;
		}
	}else{
		
		console.log ("That spline already exists here.")
	}
	
	refreshSplines();
}

function parseMessage(msg){
	
	if (msg.indexOf("new_spline")>-1){
		msg = msg.substring(msg.indexOf('{'), msg.length)
		console.log('msg is' + msg);
		var msgJSON = JSON.parse(msg);
		
		if (msgJSON.id){
			createSpline(msgJSON);
		}
	}else if(msg.indexOf("remove_spline")>-1){
		var rmSpline = msg.replace("remove_spline","")
		if (!splineId || rmSpline.toString()!=splineId.toString()){
			var rmIndex=-1;
			for (var i=0;i<splines.length;i++){
				if (splines[i].id.toString() == rmSpline.toString()){
					rmIndex = i;
					break;
				}
			}
			if (rmIndex>-1){
				splines[rmIndex].movAnim.stop();
				splines[rmIndex].splineLayer.remove();
				splines.splice(rmIndex,1);
				console.log ("Removed a spline");
				refreshSplines();
			}
		}
	}else if (msg.indexOf("existingSpline")>-1){
		msg = msg.replace("existingSpline", "");
		msg = msg.substring(msg.indexOf('{'), msg.length)
		console.log ("creating existing spline with: " + msg);
		var msgJSON = JSON.parse(msg);
		createSpline(msgJSON);
	}else if (msg=='reconnectRequest'){
		showSplineExistence()
	}
	else { //move the damn spline!
		msg = JSON.parse(msg);
//		console.log(">>>>>>>> moving ");
//		console.log(msg);
		try{
			var foundIndex = -1
			for (var i=0;i<splines.length;i++){
				if (msg.id == splines[i].id){
					foundIndex = i;
				}
			}
			if (foundIndex > -1){
				var mousePos = world.getMousePosition();
				if ((splines[foundIndex].oldPoint.x != msg.x) && (splines[foundIndex].oldPoint.y != msg.y)){
//					console.log("pushing: " + msg.id)
					var cp = splines[foundIndex].currentPoints
					cp.push({x:msg.x, y:msg.y})
					if (cp.length > slen)
						cp = cp.splice(cp.length-slen, cp.length);
					splines[foundIndex].currentPoints = cp;
//					console.log("cp is: ")
//					console.log (splines[foundIndex].currentPoints)
					var noPoint = new Point(splines[foundIndex].oldPoint.x, splines[foundIndex].oldPoint.y)
			        splines[foundIndex].oldPoint = noPoint
				}
			}else{
				if (!reconnectLocked)
					reconnectSplines()
			}
		}catch (e){
			console.log ("Can't move it!");
			console.log(e);
		}
	}
	
}

function reconnectSplines(){
	reconnectLocked = true;
	subSocket.push("reconnect")
	setTimeout(function(){
		reconnectLocked = false;
	})
}

function activateSpline(spline){
//	console.log ("activating spline " + spline.id)
	var locked = false;
	pond.on('mousemove touchstart', function() {
		var mp = world.getMousePosition();
		var smJSON = {id:spline.id, x:mp.x, y:mp.y}
		smJSON = JSON.stringify(smJSON);
		var lockInterval = setInterval(function(){
			locked = false;			
		}, 500)
		
		if (!locked){
			subSocket.push(smJSON);
			locked = true;
		}
	});
}

function openAnimation(spline){
	if (spline.movAnim)
		spline.movAnim.stop();

	spline.movAnim = new Kinetic.Animation(function(frame) {
        spline.shape.setPoints(spline.currentPoints);
	}, spline.splineLayer);

	spline.movAnim.start();
}

function readyRelay(){
	if (!subSocket){
		var socket = $.atmosphere;
		var request = { 
			url: '/atmosphere/followerRelay',
			contentType : "application/json",
			logLevel : 'debug',
			transport : 'websocket' 
		};
		
		request.onOpen = function(response){
			if (response.transport == "websocket" && !response.error){
				console.log ("Relayer is ready..");
				console.log (response);
			}else{
				alert("Could not initialize.. Try refreshing.")
			}
		}
		
		request.onMessage= function(response){
			parseMessage(response.responseBody);
		}
		
		request.onError= function(response){
			console.log("Some error occurred: \n ");
			console.log(response);
		}
		
		subSocket = socket.subscribe(request);
		$("#openSpline").removeAttr("disabled");
	}
}

var created = false;

$(document).ready(function() {
	if (!created) {
		createEnvironment();
	}
	
	$("#openSpline").click(function(){
		if (subSocket){
			$("#openSpline").attr("disabled","disabled");
			setSpline = true;
			subSocket.push("createSpline");
		}
	});

	window.onbeforeunload = function(e) {
		if (splineId && subSocket){
			console.log ("Removing spline...")
			subSocket.push("remove_spline"+splineId)
		}
	};
})
