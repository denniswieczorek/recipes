To run website:
>start mongod processes
>npm install
>npm run parse
>npm run start 

Then visit localhost:3000/recipes
On first visit you will be redirected to the login page.
After that you can visit from localhost:3000/recipes/search?filter=spices&search=cumin

To register simply follow the instructions and then log in.
You can search by name,spices or ingredient.  Case insensitive.

Notable Bugs:
-Uploading a photo, works if you have the images saved in the public folder, unable to delete, and when editing doesnt tell you what file is save in there. 
-Ingredient list and recipe list can be faulty depending on the recipe.(blank lists or lists on seperate lines that shouldnt be)

Credits to:
Brad Traversy- His videos on youtube were fundemental in the login development.  src = https://www.youtube.com/watch?v=Z1ktxiqyiLA
