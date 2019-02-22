//REQUIREMENTS
var fs = require('fs');
var lineReader = require('line-reader');
var MongoClient = require('mongodb').MongoClient;
const DB_URL = 'mongodb://localhost:27017'


//database name
const dbName = 'recipeDB'

var inputFilePath = __dirname + "/aLaCarteData_rev3.xml";


//write to mongo database
function writeToDataBase(recipes){
  MongoClient.connect(DB_URL, {useNewUrlParser: true }, function(err,client){
  if(err) {
    console.log("error connecting to dbpath");
  }
  else {
    console.log("connected")
      const db = client.db(dbName)

      db.collection('recipes',function(err,collection){
        collection.countDocuments(function(err,count){
        if(err) throw err;
        if(count == 0){ //if I am running it for the first time
            collection.insertMany(recipes)

                 client.close();
               }
                else{
                  client.close();
                }



      //    }}
        })


  })

  console.log("done")

}
})}


//Parser Bit

function isTag(input){
  return input.startsWith("<");
}
function isOpeningTag(input){
  return input.startsWith("<") && !input.startsWith("</");
}
function isClosingTag(input){
  return input.startsWith("</");
}

var dataString = []; //data between tags to be collected
var openingTag = ""; //xml opening tags
var recipes = []; //all recipes parsed
var currentRecipe = {} // current recipe being parsed

lineReader.eachLine(inputFilePath,function(line,last){
      str = line.trim();

      if(isOpeningTag(str)){
        openingTag = str.replace("<","").replace(">","");

        dataString = []; //clear whatever was in here

      }
      else if(isClosingTag(str)){
          if(str === "</recipe>"){
            recipes.push(currentRecipe);
            currentRecipe = {};

          }else if(openingTag === "recipe_name") {
            currentRecipe.recipe_name = dataString.join(" ");
            openingTag = "";
          }else if(openingTag === "contributor"){
            currentRecipe.contributor= dataString.join(" ");
            openingTag = "";
          }else if(openingTag === "category"){
            currentRecipe.category= dataString.join(" ");
            openingTag = "";
          }else if(openingTag ==="description" ){
            currentRecipe.description= dataString.join(" ");
            openingTag = "";
          }else if(openingTag === "spices"){
            console.log(dataString)
            currentRecipe.spices = dataString;
            openingTag = "";
          }else if(openingTag === "source"){
            currentRecipe.source= dataString.join(" ");
            openingTag = "";
          }else if(openingTag === "rating"){
            currentRecipe.spiciness= dataString.join(" ");
            openingTag = "";
          }else if(openingTag === "ingredients"){
            currentRecipe.ingredients= dataString;
            openingTag = "";
          }else if(openingTag ==="directions" ){
            currentRecipe.directions= dataString.join(" ");
            openingTag = "";
          }




      }
      else{
        dataString.push(str);// += (" " + str);
      }


      if(last){
        console.log("Done parsing");
        writeToDataBase(recipes);
        return false; //stop reading
      }
})
