<!doctype HTML>
<html>
	<head>
		<title>Tadpoles!</title>
		<g:javascript library="jquery" plugin="jquery"></g:javascript>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"kinetic.js") }"></script>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"datpole.js") }"></script>
		<style>
			#world-container {position:fixed;top:0px;left:0px;width:100%;height:100%;background:#000;}
			#log-container {position:fixed;right:0px;width:450px;background:black;z-index:20;height:350px;font-size:12px;color:#fff;padding:10px;font-family:arial;overflow:auto;top:0px}	
			#info-container {position:fixed;bottom:0px;width:850px;background:black;z-index:20;height:70px;font-size:12px;color:#fff;padding:10px;font-family:arial;overflow:auto;left:0px;}			
		</style>
		
	</head>
	<body>
		<div id="log-container">
			<input type="button" value="Generate Event" id="genEvent" />
		</div>
		<div id="info-container"></div>
		<div id="world-container">
			
		</div>
	</body>
</html>