<!doctype HTML>
<html>
	<head>
		<title>Tadpoles!</title>
		<g:javascript library="jquery" plugin="jquery"></g:javascript>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"kinetic.js") }"></script>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"tadpole.js") }"></script>
		<style>
			body {}
			#pothole-container {position:fixed;top:0px;left:0px;width:100%;height:100%;background:#000;}				
			.tadpole {}
		</style>
		
	</head>
	<body>
		<div id="pothole-container">
			
		</div>
	</body>
</html>