const ytdl = require('ytdl-core');
const http = require('http'); 
const url = require('url');
http.createServer(onrequest).listen(process.env.PORT || 3000);

function onrequest(request, response) {
	console.log("got request!");
	var oUrl = url.parse(request.url, true);
	
	if (oUrl.path === "/favicon.ico") {
		response.statusCode = 404;
		response.end("404");
		console.log("invalid request")
		return;
	}
	
	if (!oUrl.query.url) {
		response.statusCode = 404;
		response.end("404");
		console.log("invalid request")
		return;
	} else {
		var dUrl = oUrl.query.url;
		console.log("got url: " + dUrl);
	}
	if (!oUrl.query.format) {
		ytdl(dUrl, function(err, info) {
			let vaFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
			var json = JSON.stringify ({
				datainfo: vaFormats
			})
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
		})
	} else if (oUrl.query.format === "audioOnly") {
		ytdl(dUrl, function(err, info) {
			let aFormats = ytdl.filterFormats(info.formats, 'audioonly');
			var json = JSON.stringify ({
				datainfo: aFormats
			})
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
		})
	}
}
