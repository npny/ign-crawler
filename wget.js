const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const request = require("request");
const EventEmitter = require('events').EventEmitter;


function wget(url, output, options, successCb, errorCb) {

	if(!successCb) successCb = () => {};
	if(!errorCb) errorCb = () => {};
	if(!options) options = {};
	options.url = url;

	const eventEmitter = new EventEmitter();

	mkdirp(path.dirname(output), function() {

		const outputStream = fs.createWriteStream(output, {
			flags: "w+",
			encoding: "binary"
		});

		outputStream.on("open", function(){

			const req = request(options);
			req.pipe(outputStream);
			outputStream.on("finish", () => outputStream.close(successCb));



			const errorCallback = err => {
				fs.unlink(output); // Delete the file async. (But we don't check the result)
    			errorCb(err);
			}

			req.on("response", response => response.statusCode === 200 || errorCallback(response.statusCode));
			req.on("error", errorCallback);
			outputStream.on("error", errorCallback);

		});
	});

	return eventEmitter;
}


module.exports = wget;