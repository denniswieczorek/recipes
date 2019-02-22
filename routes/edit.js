var express = require('express');
var router = express.Router();
var User = require('../models/user')
var newEdit = require('../models/recipes');

router.get('/create',ensureAuthenticated,function(req,res){
  res.render('create');
})


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }else {
  //  req.flash('error_msg',"You are not logged in");
    res.redirect('/users/login')
  }
}

router.post('/create',function(req,res){
  var recipe_name = req.body.recipe_name;
  var contributor = res.locals.user.username;
  var category = req.body.category;
  var description = req.body.description;
  var spices = (req.body.spices.split('&')).filter(function(e){return e.trim() !=''});
  var source = req.body.source;
  var spiciness = req.body.spiciness;
  var ingredients = (req.body.ingredients.split('&')).filter(function(e){return e.trim() !=''});
  var directions = req.body.directions;
  var picture = req.body.picture;
console.log(spices);

  var newRecipe = {
    recipe_name: recipe_name,
    contributor: contributor,
    category: category,
    description: description,
    spices : spices,
    source: source,
    spiciness: spiciness,
    ingredients: ingredients,
    directions: directions,
     picture: picture
  }
  //validation
  req.checkBody("recipe_name","Recipe Name is required").notEmpty();
  req.checkBody("description","Description is required").notEmpty();
  req.checkBody("category","Category is required").notEmpty();
  req.checkBody("source","Source is required").notEmpty();
  req.checkBody("spiciness","Spiciness is required").notEmpty();
  req.checkBody("ingredients","Ingredients are required").notEmpty();
  req.checkBody("directions","Directions are required").notEmpty();

   var errors = req.validationErrors();
   if(errors){
     res.render("create",{
       errors:errors,
       recipe:newRecipe
     });
   }else {
     //move this so that you dont have to retype everything if you make a misake



     newEdit.createRecipe(newRecipe,function(err,recipe){
       if(err) throw err;
       console.log(recipe.ops[0]._id);

       req.flash('success_msg',"You have successfully created a recipe");
       res.redirect(`/recipes/recipeDetails/recipe_id?id=${recipe.ops[0]._id}`)
     })

   }








})



module.exports = router;
