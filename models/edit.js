var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var DB_PATH = "mongodb://localhost:27017/recipeDB";



module.exports.createRecipe = function(newRecipe,callback){
  MongoClient.connect(DB_PATH,function(err,db){
    if(err) throw err;

    db.collection('recipes',function(err,collection){
      collection.insert(newRecipe,callback);
    })
  })
}
