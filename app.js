var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("mongodb");


var routes = require('./routes/index');
var users = require('./routes/users');
var edit = require('./routes/edit')

//init express app
var app = express();

//view engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//set public folter
app.use(express.static(path.join(__dirname,'public')));

//express session
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '['  + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//connect flash
app.use(flash());

//global vars
app.use(function (request, response, next){
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  response.locals.user = request.user || null;
  next();
});





app.use('/recipes',routes);
app.use('/users',users);
app.use('/edit',edit);

app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),function(){
  console.log('server started on port ' + app.get('port')+ ' visit http://localhost:3000/recipes to view crtl+c to quit');
});
