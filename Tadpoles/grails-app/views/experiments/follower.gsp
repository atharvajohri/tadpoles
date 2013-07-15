<!doctype HTML>
<html>
	<head>
		<title>Tadpoles!</title>
		<g:javascript library="jquery" plugin="jquery"></g:javascript>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"kinetic.js") }"></script>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"followers.js") }"></script>
		<script type="text/javascript" src="${createLinkTo(dir:"js",file:"jquery.atmosphere.js") }"></script>
		<style>
			#world-container {position:fixed;top:0px;left:0px;width:100%;height:100%;background:#000;}
			#log-container {position:fixed;right:0px;width:250px;background:black;z-index:20;height:350px;font-size:12px;color:#fff;padding:10px;font-family:arial;overflow:auto;top:0px;opacity:0.7}
			#spline-tracker {border:1px solid white;color:#fff;}
			.spline-color {width:55px;height:15px;}
			.spline-row {border-bottom:1px solid #fafafa;}
		</style>
	</head>
	<body>
		<div id="log-container">
			<input type="button" value="Generate Event" id="genEvent" /><br>
			<input type="button" value="Open Spline" id="openSpline" disabled="disabled"/><br>
			<div id="spline-tracker">
				<table>
					
				</table>
			</div>
		</div>
		<div id="world-container"></div>
	</body>
</html>