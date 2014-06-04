var express = require('express');


var mongo = require('mongodb'), 
MongoClient = mongo.MongoClient,
Grid = mongo.Grid;



var app = express();
app.use(app.router);

app.get('/s/:item(*)', function(req, res){
  console.log("inside route");
  console.dir(req.params);

  var id = {
    "bundle": "cn-fe-ads",
    "ver": "1.0.0",
    // "path": "image_thumb6.png"
    "path": req.params.item
  };
  MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if(err) throw err;
    var grid = new Grid(db, 'fs');
    var collection = db.collection('fs.files');
    collection.findOne({_id: id}, function(err, fileInfo){
      if(err){
        throw err;
      }

      if(!fileInfo){
        return res.send(req.params.item + " NOT FOUND", 404);
      }

      grid.get(fileInfo._id, function(err, data) {
        if(err){
          throw err;
        }
        // console.log("Retrieved data: " + data.toString());
                  res.set("Content-Type", fileInfo.contentType);
        res.send(data);
        // fs.writeFile('./test.png', data, function(ferr){
          // console.log(ferr);
          // console.log('done');
        // });
      });

    });
  });

});
app.get('/debug', function(req, res){
  res.send({routes: app.routes});
});

app.listen(2000, function(){
  console.log("online");
})