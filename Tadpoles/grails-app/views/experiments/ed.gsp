<!doctype HTML>
<html>
	<head>
		<title>Attacars!</title>
		<g:javascript library="jquery" plugin="jquery"></g:javascript>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"kinetic.js") }"></script>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"ed.js") }"></script>
		<style>
			body {margin:0;padding:0;overflow:hidden}
			#log-container {position:fixed;top:0px;right:0px;width:200px;height:300px;background:#000;opacity:0.7;color:#fff;padding:10px;}
			#world-container {border:1px solid black;width:800px;height:500px;}
		</style>
	</head>
	<body>
		<div id="log-container">
		</div>
		<canvas id="world-container"></canvas>
	</body>
</html>