const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
let filter;
const http = require('http'); 
const url = require('url');
var fetchVideoInfo = require('youtube-info');
http.createServer(onrequest).listen(process.env.PORT || 3000);

function onrequest(request, response) {
	var oUrl = url.parse(request.url, true);
	
	if (!oUrl.query.url && !oUrl.query.search && !oUrl.query.md) {
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
				limit: 10,
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
	
	if (oUrl.query.md) {
		var md = oUrl.query.md
		var yt = url.parse(md);
		var id = yt.query.v;
		if (!id) {
			var json = JSON.stringify ({
				"err": "noProperUrl"
			})
			response.writeHead(404, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
			console.log("invalid request")
			console.log(err)
			return;
		}
		console.log(id)
		fetchVideoInfo(id, function (err, videoInfo) {
			if (err) {
				var json = JSON.stringify ({
					"err": err
				})
				response.writeHead(404, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json);
				console.log("youtube-info err")
				console.log(err)
				return;
			} else {
				var json = JSON.stringify ({
					"meta": videoInfo
				})
				response.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json);
				console.log("got metadata for url: " + md)
				return;
			}
		})
		return;
	}
	
	if (oUrl.query.info === "1") {
		console.log("getting info for url: " + dUrl);
		ytdl(dUrl, function(err, info) {
			if (!err) {
				var json = JSON.stringify ({
					info
				})
				response.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json);
			} else {
				var json = JSON.stringify ({
					err
				})
				response.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				response.end(json);
			}
		})
		return;
	}
	
	if (oUrl.query.audio === "1") {
		if (!dUrl.includes("http")) {
			var json = JSON.stringify ({
				"err": "mustBeUrl"
			})
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
			console.log("invalid request")
			return;
		}
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
				datainfo: aFormats,
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
	
	ytdl(dUrl, function(err, info) {
		if (!dUrl.includes("http")) {
			var json = JSON.stringify ({
				"err": "mustBeUrl"
			})
			response.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			response.end(json);
			console.log("invalid request")
			return;
		}
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
