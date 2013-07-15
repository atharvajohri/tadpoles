<!doctype HTML>
<html>
	<head>
		<title>Attacars!</title>
		<g:javascript library="jquery" plugin="jquery"></g:javascript>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"kinetic.js") }"></script>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"attacar.js") }"></script>
		<style>
			body {margin:0;padding:0;overflow:hidden}
			#log-container {position:fixed;top:0px;right:0px;width:200px;height:300px;background:#000;opacity:0.7;color:#fff;padding:10px;}
		</style>
	</head>
	<body>
		<div id="log-container">
			Ast:<div id="ast">0</div>
			dy:<div id="dy">0</div>
			speed:<div id="speed">0</div>
		</div>
		<div id="world-container"></div>
	</body>
</html>