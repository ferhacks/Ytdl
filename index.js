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
	
	if (!oUrl.query.url | !oUrl.query.url.includes("youtu")) {
		response.statusCode = 404;
		response.end("404");
		console.log("invalid request")
		return;
	} else {
		var dUrl = oUrl.query.url;
		console.log("got url: " + dUrl);
	}
	
	ytdl(dUrl, function(err, info) {
		if (err) {
			var json = JSON.stringify ({
				datainfo: err
			})
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
			return;
		}
		var json = JSON.stringify ({
			datainfo: info
		})
		response.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		response.end(json);
	})
}
