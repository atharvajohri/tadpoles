package com.tp.core

import grails.converters.JSON
import java.io.IOException;

import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereRequest;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResponse;

public class FollowerRelayerService implements AtmosphereHandler {

	static transactional = false
	static atmosphere = [mapping: '/atmosphere/followerRelay']
            
	def helperService 
	def flushResponse = false
	
	@Override
	public void onRequest(AtmosphereResource r) throws IOException {
		 AtmosphereRequest req = r.getRequest();
		if (req.getMethod().equalsIgnoreCase("GET")) {
//			log.info ("got get")
			r.suspend();
		} else if (req.getMethod().equalsIgnoreCase("POST")) {
		
			def data = req.getReader().readLine().trim()
			log.info ("Got post: " + data)
			if (data=="createSpline"){ //a new user joins!
				log.info "Requesting new spline"
				Random random = new Random()
				def actionResponse = [:]
				def color = helperService.getRandomColor()
				actionResponse.id = random.nextInt(99999)
				actionResponse.action = "new_spline"
				actionResponse.color = color
				log.info("Opening spline: " + actionResponse.id)
				r.getBroadcaster().broadcast(actionResponse as JSON);
				flushResponse = true;
			}else if(data.indexOf("reconnect") > -1){ // a spline tells of it's existence!
//				data = data.replace("existingSpline", "");
				r.getBroadcaster().broadcast('reconnectRequest');
			}else{ //a spline moves!
				r.getBroadcaster().broadcast(data);
			}
		}
		
	}

	@Override
	public void onStateChange(AtmosphereResourceEvent event) throws IOException {
		AtmosphereResource r = event.getResource();
		AtmosphereResponse res = r.getResponse();
		
		if (r.isSuspended()) {
			String points = event.getMessage().toString();
//			log.info ("got body as ${points}")
		
			res.getWriter().write(points);
			
			if (flushResponse){
				res.getWriter().flush();
				flushResponse = false;
			}
//			switch (r.transport()) {
//				case JSONP:
//				case LONG_POLLING:
//					event.getResource().resume();
//					break;
//				case WEBSOCKET :
//				case STREAMING:
//					res.getWriter().flush();
//					break;
//			}
		} else if (!event.isResuming()){
			log.info ("Shutting Down..")
//			event.broadcaster().broadcast("Shutting Down..").toString();
		}
	}
	
	@Override
	public void destroy() {
	
	}

}
