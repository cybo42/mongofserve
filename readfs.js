var mongo = require('mongodb'), 
  MongoClient = mongo.MongoClient,
  Grid = mongo.Grid;

  var fs = require('fs');

var id = {
    "bundle": "cn-fe-ads",
    "ver": "1.0.0",
    "path": "image_thumb6.png"
    // "path": "META-INF/flatpages/ads/eyeblaster/addineyeV2.html"
};
  MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if(err) throw err;
    var grid = new Grid(db, 'fs');
    grid.get(id, function(err, data) {
      // console.log("Retrieved data: " + data.toString());
      fs.writeFile('./test.png', data, function(ferr){
        console.log(ferr);
        console.log('done');
      });
    });
});