const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
let filter;
const http = require('http'); 
const url = require('url');
http.createServer(onrequest).listen(process.env.PORT || 3000);

function onrequest(request, response) {
	var oUrl = url.parse(request.url, true);
	
	if (!oUrl.query.url && !oUrl.query.search) {
		response.statusCode = 404;
		response.end("404");
		console.log("invalid request")
		return;
	} else {
		var dUrl = oUrl.query.url;
	}
	
	if (oUrl.query.search) {
		var search = oUrl.query.search;
		console.log("searched for: " + search);
		ytsr.getFilters(search, function(err, filters) {
			filter = filters.get('Type').find(o => o.name === 'Video');
			var options = {
				limit: 5,
				nextpageRef: filter.ref,
			}
			ytsr(search, options, function(err, searchResults) {
				var json = JSON.stringify ({
					searchResults
				})
				response.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json);
			})
		})
		return;
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
			if (err) {
				console.log("error!: " + err)
				var json = JSON.stringify ({
					"err": err
				})
				response.writeHead(404, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json)
				return;
			}
			if (!info.formats) {
				console.log("no formats found")
				var json = JSON.stringify ({
					"err": "noFormats"
				})
				response.writeHead(404, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json)
				return;
			}
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
		if (err) {
			console.log("error!: " + err)
			var json = JSON.stringify ({
				"err": err
			})
			response.writeHead(404, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json)
			return;
		}
		if (!info.formats) {
			console.log("no formats found")
			var json = JSON.stringify ({
				"err": "noFormats"
			})
			response.writeHead(404, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json)
			return;
		}
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
