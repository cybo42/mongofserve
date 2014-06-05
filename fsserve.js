var 
  mongo = require('mongodb')
  , MongoClient = mongo.MongoClient
  , Grid = mongo.Grid
  , express = require('express')
  , app = express()
;

app.use(app.router);

app.get('/debug', function(req, res){
  res.send({routes: app.routes});
});

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db){
  if(err) throw err;

  var grid = new Grid(db, 'fs')
    ,  collection = db.collection('fs.files')
  ;

  app.get('/:item(*)', function(req, res){
    var id = {
      "bundle": "cn-fe-ads",
      "ver": "1.0.0",
      "path": req.params.item
    };

    console.log("loading resource %j", id);
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

        console.log("Content-type = " + fileInfo.contentType);
        res.set("Content-Type", fileInfo.contentType);
        res.send(data);

      });
    });
  });
});

app.listen(2000, function(){
  console.log("online port 2000");
});
