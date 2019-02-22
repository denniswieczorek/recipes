var express = require('express');
var router = express.Router();
var url = require("url")

var Recipe = require('../models/recipes')

//get homepage
router.get('/',ensureAuthenticated,function(req,res){
  var username = res.locals.user.username;
  res.render('index',{user: username});

});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }else {
  //  req.flash('error_msg',"You are not logged in");
    res.redirect('/users/login')
  }
}

router.post('/',function(req,res){
  var searchRequest = req.body.searchRequest.split(',');
  //trim out white spaces find better way to do this
  for(let i = 0; i<searchRequest.length;i++){
    searchRequest[i]=searchRequest[i].trim();
  }
  //then join together to get form cumin+salt
  searchRequest=searchRequest.join("+")

  var criteria = req.body.criteria;
  var username = res.locals.user.username;
  req.checkBody("searchRequest","Not a valid search").notEmpty();
  req.checkBody("searchRequest","Searches must be at least 3 characters long").isLength({min: 3, max:49})
  var errors = req.validationErrors();

  if(errors){
    res.render("index",{
      errors:errors,
      user: username
    });
  }else{

    res.redirect(`/recipes/search?filter=${criteria}&search=${searchRequest}`)
  }


})


//get recipe list
router.get('/search*',ensureAuthenticated,function(req,res){
  //res.render('recipeList')
   var filter = req.query.filter;
   var search = req.query.search;
   var username = res.locals.user.username;
   Recipe.getRecipeArray(filter,search,function(err,items){
   if(err) throw err;

   if(items.length==0){
     req.flash('error_msg',"Sorry, no results were found");
     res.redirect('/recipes');

   }else{

   res.render('recipeList',{recipe:items})
 }})
})
//GET RECIPE DETAILS
router.get('/recipeDetails/recipe_id*',ensureAuthenticated,function(req,res){
  var urlObj = url.parse(req.url);
  var recipeID = req.query.id;



  Recipe.getSpecificRecipe(recipeID,function(err,result){
    if(err) throw err;
    res.render('recipeDetails',{recipe:result});
  })

});

router.get('/recipeDetails/edit/recipe_id*',ensureAuthenticated,function(req,res){
    var recipeID = req.query.id;
    Recipe.getSpecificRecipe(recipeID,function(err,result){
        if(err) throw err;
        res.render('edit_recipe',{recipe:result});
    })
})


router.post('/recipeDetails/edit/recipe_id*',function(req,res){
  var recipeID= req.query.id;
  var recipe_name = req.body.recipe_name;
  var editedBy = res.locals.user.username;
  var category = req.body.category;
  var description = req.body.description;
  var spices = (req.body.spices.split('&')).filter(function(e){return e.trim() !=''});
  var source = req.body.source;
  var spiciness = req.body.spiciness;
  var ingredients = (req.body.ingredients.split('&')).filter(function(e){return e.trim() !=''});
  var directions = req.body.directions;
  var picture = req.body.picture;

  req.checkBody("recipe_name","Recipe name is required").notEmpty();
  req.checkBody("description","Description is required").notEmpty();
  req.checkBody("category","Category is required").notEmpty();
  req.checkBody("source","Source is required").notEmpty();
  req.checkBody("spiciness","Spiciness is required").notEmpty();
  req.checkBody("ingredients","Ingredients are required").notEmpty();
  req.checkBody("directions","Directions are required").notEmpty();

  var currentRecipe = {
    recipe_name: recipe_name,
    category: category,
    description: description,
    spices : spices,
    source: source,
    spiciness: spiciness,
    ingredients: ingredients,
    directions: directions,
    editedBy: editedBy,
    picture: picture

}

  var errors = req.validationErrors();
  if(errors){
    res.render("edit_recipe",{
      errors:errors,
      recipe: currentRecipe

    });
  }else {



    Recipe.editRecipe(currentRecipe,recipeID,function(err,recipe){
      if(err) throw err;
      req.flash('success_msg',"You have successfully edited the recipe");
      res.redirect(`/recipes/recipeDetails/recipe_id?id=${recipeID}`)
    })


};
});



module.exports = router;
