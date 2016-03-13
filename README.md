# [ign-crawler](https://github.com/npny/ign-crawler)

This quick little script can extract map tiles from an HTTP WMTS source.  
Specifically, it was designed to generate a local version of the [IGN 1:500k VFR charts](http://tab.geoportail.fr/?c=0.6926269531250144,47.94476037830143&z=6&l0=ORTHOIMAGERY.ORTHOPHOTOS:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI:WMTS(1)&permalink=yes) for personal use.  

It has provisions for spreading requests out in time (we're not DoS-ing, here), and using commonly expected headers (to bypass 403 errors).

[MIT](http://opensource.org/licenses/mit-license.php) - Pierre Boyer, 2016.


Usage
-----
`npm install`  
`node ign-crawler.js`  
`# go for a walk`  
`du -sh data/`
> 81M data
