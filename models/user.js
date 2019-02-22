const MongoClient = require("mongodb").MongoClient;
const DB_URL = "mongodb://localhost:27017"
const ObjectId = require("mongodb").ObjectId
const dbName = "recipeDB";
const bcrypt = require('bcryptjs');


module.exports.createUser = function(newUser,callback) {
  MongoClient.connect(DB_URL, {useNewUrlParser: true }, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    db.collection("users", function(err, collection){
      collection.createIndex({"username": 1}, {unique: true})
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            collection.insertOne(newUser, callback)
        });
    });
    })
}
)}



module.exports.getUserByUsername = function(username,callback){
  MongoClient.connect(DB_URL, {useNewUrlParser: true }, function(err, client){
    if(err) throw err;
    const db = client.db(dbName);
    db.collection("users", function(err, collection){
      collection.findOne({username: username},callback)
    })
  })

}


module.exports.getUserById = function(id,callback){
  MongoClient.connect(DB_URL, {useNewUrlParser: true }, function(err, client){
    if(err) throw err;
    const db = client.db(dbName);
    db.collection("users", function(err, collection){
      collection.findOne(ObjectId(`${id}`), callback);
    });
  })

}


module.exports.comparePassword = function(candidatePassword,hash,callback){

    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
       if(err) throw err;
       callback(null,isMatch);
  });
}
