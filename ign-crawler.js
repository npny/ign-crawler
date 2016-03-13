const wget = require("./wget");
const utils = require("./utils");


function downloadTile(level, x, y) {

	utils.Scheduler.addTask(() => {

		// console.log(level + "/" + y + "/" + x);
		wget(
			downloadUrl(level, y, x),
			outputPath(level, y, x),
			{headers: fakeHeaders},
			utils.Scheduler.taskCompleted,
			err => console.log(err)
		)

	});

}


function downloadLevel(level, x1, y1, x2, y2) {
	for(var y = y1; y <= y2; y++)
			for(var x = x1; x <= x2; x++)
				downloadTile(level, x, y);
}


// `level` is the depth of the world quadtree, and as you change depth, the actual integer values of the
// starting tile indexes, ending tile indexes, and number of intemediate tiles for a constant geographical
// region all change wildly.
// Instead, we specify the region in float coordinates (u,v in [0.0; 1.0])
// Then, since we know the total number of divisions at a given level of the quadtree (2^level),
// we can much more easily project the 0-1 range onto the tile range (e.g. 64 for level 6),
// which gives us the integer indexes, which are the ones fed to downloadLevel()
 
function downloadVolume(u1, v1, u2, v2, levelStart, levelStop) {

	for(var level = levelStart; level <= levelStop; level++) {
		var divisions = Math.pow(2, level);
		var x1 = Math.round(u1 * divisions);
		var y1 = Math.round(v1 * divisions);
		var x2 = Math.round(u2 * divisions);
		var y2 = Math.round(v2 * divisions);

		downloadLevel(level, x1, y1, x2, y2);
	}

}


// Specific parameters for IGN OACI VFR charts
var downloadUrl, outputPath, fakeHeaders;
function downloadOACI() {

	utils.Scheduler.interval = 2000;
	downloadUrl = (level, x, y) => `http://wxs.ign.fr/j5tcdln4ya4xggpdu4j0f0cn/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX=${level}&TILEROW=${y}&TILECOL=${x}&FORMAT=image%2Fjpeg`;
	outputPath = (level, x, y) => `data/${ level }/${ x }_${ y }.jpg`;
	fakeHeaders = {
		"Accept": "image/webp,image/*,*/*;q=0.8",
		"Accept-Encoding": "gzip, deflate, sdch",
		"Accept-Language": "en-US,en;q=0.8,fr;q=0.6",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
		"Host": "wxs.ign.fr",
		"Pragma": "no-cache",
		"Referer": "http://tab.geoportail.fr/?c=0.6926269531250144,47.94476037830143&z=6&l0=ORTHOIMAGERY.ORTHOPHOTOS:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI:WMTS(1)&permalink=yes",
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36",
	};


	downloadVolume(21/64, 31/64, 23/64, 33/64, 6, 11);
	utils.Scheduler.nextTask();
}


module.exports = {
	downloadTile,
	downloadLevel,
	downloadVolume,
	downloadOACI
}

if(require.main === module) downloadOACI();