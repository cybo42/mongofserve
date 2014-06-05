var fs = require('fs');
var name = process.argv[2];
var mime = require('mime');

var mongo = require('mongodb'), 

MongoClient = mongo.MongoClient,
Grid = mongo.Grid;

var Q = require('q');

console.log("Reading file " + name);
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	if(err) throw err;

	fs.readFile(name, function(err, data){
		if(err){
			throw err;
		}
		var zip = new require('node-zip')(data, {base64: false, checkCRC32: true});

		console.dir(Object.keys(zip.files));
		var promises = Object.keys(zip.files).map(function(name){
			var d = Q.defer();
			var entry = zip.files[name];
			console.dir(entry);

			if(!entry.options.dir){
				var grid = new Grid(db, 'fs');
				var contentType = mime.lookup(name);
				console.log("Binary = %s, Mime Type %s", entry.options.binary, contentType);
				var buffer = (entry.options.binary)? entry.asNodeBuffer(): new Buffer(entry._data);
				grid.put(buffer, 
					{_id: {bundle: "cn-fe-ads", ver: "1.0.0", path: name},
					metadata:{},
					filename: name,
					content_type: contentType }, function(err, fileInfo) {
						if(err){ 
							console.log("hello");
							d.reject(err);
						}
						console.dir(fileInfo);
						d.resolve(fileInfo);
					});
			}else{
				d.resolve();
			}

			return d.promise;

		});

        Q.allSettled(promises).then(function(){
        	console.log("all done closing connection");
        	db.close();
        });

	});

		// db.close();

});
