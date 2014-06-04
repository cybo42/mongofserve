var fs = require('fs');
var name = process.argv[2];
var mime = require('mime');

var mongo = require('mongodb'), 
MongoClient = mongo.MongoClient,
Grid = mongo.Grid;

console.log("Reading file " + name);
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	if(err) throw err;

	fs.readFile(name, function(err, data){
		if(err){
			throw err;
		}
		var zip = new require('node-zip')(data, {base64: false, checkCRC32: true});

		console.log(typeof zip.files);
		Object.keys(zip.files).forEach(function(name){
			var entry = zip.files[name];
	     		console.dir(entry);
	     		if(!entry.options.dir){
	     			var grid = new Grid(db, 'fs');
	     			var contentType = mime.lookup(name);
	     			console.log("Mime %s", contentType);
	     			var buffer = (entry.options.binary)? entry.asNodeBuffer(): new Buffer(entry._data);
	     			grid.put(buffer, {
	     				_id: {bundle: "cn-fe-ads", ver: "1.0.0", path: name}, 
	     				metadata:{category:'text'},
	     				content_type: contentType }, function(err, fileInfo) {
	     					if(err){ 
	     						console.log("hello");
	     						throw err;
	     					}
	     					console.dir(fileInfo);
		     		});
	     		}
	     	});

			// db.close();
	     });



});
