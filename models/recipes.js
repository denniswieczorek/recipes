var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var DB_URL = "mongodb://localhost:27017";
const dbName = "recipeDB";


module.exports.getRecipeArray = function(filter,search,callback){
  MongoClient.connect(DB_URL, {useNewUrlParser: true }, function(err,client){
    if(err) throw err;
    else{
      const db = client.db(dbName);
      search = search.split(" ");
      for(var j=0;j<search.length;j++){
        search[j] = new RegExp(`${search[j]}`,'i')
      };
      var reg = {'$in': ''};
      var query = {};
      reg['$in'] = search;
      query[filter] = reg;

      db.collection('recipes',function(err,collection){
        collection.find(query).toArray(callback);
      });
    }
  }
)}


module.exports.getSpecificRecipe = function(recipeID,callback){
  MongoClient.connect(DB_URL, {useNewUrlParser: true }, function(err,client){
    if(err) throw err;
    const db = client.db(dbName);
    db.collection('recipes',function(err,collection){
      collection.findOne(ObjectId(`${recipeID}`), callback);
    });
  })
}
module.exports.createRecipe = function(newRecipe,callback){
  MongoClient.connect(DB_URL,  {useNewUrlParser: true },function(err,client){
    if(err) throw err;
    const db = client.db(dbName);
    db.collection('recipes',function(err,collection){
      collection.insertOne(newRecipe,callback);
    })
  })
}

module.exports.editRecipe = function(currentRecipe,recipeID,callback){
  MongoClient.connect(DB_URL,  {useNewUrlParser: true },function(err,client){
    if(err) throw err;
    const db = client.db(dbName)
    db.collection('recipes',function(err,collection){
      collection.update(
        {_id: ObjectId(`${recipeID}`)},
        {
          $set: currentRecipe
        },
      callback);
    })
  })
}
