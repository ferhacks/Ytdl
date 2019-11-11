const ytdl = require('ytdl-core');
const http = require('http'); 
const url = require('url');

console.log("starting up...")

http.createServer(function (req, res) { 
	console.log("got request!")
	
	if (!url.parse(req.url,true).search) {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.end("404: no url found");
		return;
	} else {
		var dUrl = url.parse(req.url,true).search.substring(5,999);
		console.log("parsed url: " + dUrl);
	}
	
	ytdl(dUrl, function(err, info) {
		var json = JSON.stringify ({
			datainfo: info
		})
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(json);
	})
}).listen(3000);

console.log("listening...")