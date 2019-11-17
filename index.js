const ytdl = require('ytdl-core');
const http = require('http'); 
const url = require('url');
http.createServer(onrequest).listen(process.env.PORT || 3000);

function onrequest(request, response) {
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
	}
	
	if (oUrl.query.info === "1") {
		console.log("getting info for url: " + dUrl);
		ytdl(dUrl, function(err, info) {
			var json = JSON.stringify ({
				info
			})
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
		})
		return;
	}
	
	if (oUrl.query.audio === "1") {
		ytdl(dUrl, function(err, info) {
			console.log("getting audio download url: " + dUrl);
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
		return;
	}
	
	ytdl(dUrl, function(err, info) {
		console.log("getting video download url: " + dUrl);
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
}
