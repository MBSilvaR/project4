const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const methodoverride = require('method-override');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(methodoverride('_method'));

app.use(session({
  secret: 'testtesttest',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))

// process.env.TWILIO_ACCOUNT_SID
// process.env.TWILIO_API_KEY
// process.env.TWILIO_API_SECRET
// process.env.TWILIO_CONFIGURATION_SID


require('dotenv').load();
var http = require('http');
var path = require('path');
var AccessToken = require('twilio').AccessToken;
var VideoGrant = AccessToken.VideoGrant;
// var express = require('express');
var randomUsername = require('./randos');

// Create Express webapp
// var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/*
Generate an Access Token for a chat application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/
app.get('/chat', function(request, response) {
    var identity = randomUsername();

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
   //VAR TOKEN

    // Assign the generated identity to the token
    token.identity = identity;

    //grant the access token Twilio Video capabilities
    var grant = new VideoGrant();
    grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response
    response.send({
        identity: identity,
        token: token.toJwt()
    });
});

var db = pgp(process.env.DATABASE_URL || 'postgres://marcelasilva@localhost:5432/masterkey_crud');

app.listen(port)
console.log("Server started on " + port);


app.get("/", function(req, res){
  var logged_in;
  var email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
    "logged_in": logged_in,
    "email": email
  }

  res.render('index', data);
});

app.get("/signup", function(req, res){
  res.render('signup/index')
});

app.post('/signup', function(req, res){
  var data = req.body;
  console.log(data)
  bcrypt.hash(data.password, 10, function(err, hash){
     // console.log(data.email);
     //  console.log(hash);

    db.none(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
      [data.email, hash]
    ).then(function(){
      console.log('user created');
      res.render('profile/index', {'users': data});
    })
  });
})

app.post('/profile', function(req, res){
  var data = req.body;
  console.log(data);
  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.redirect('notfound')
  }).then(function(user){
    console.log(user)
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.render('profile/index', {'users': data});
      } else {
        console.log('bcrypt failed')
        res.redirect('notfound');
      }
    });
  });
});



app.get("/", function(req, res){
  var logged_in;
  var email;

  if(req.session.hotel){
    logged_in = true;
    email = req.session.hotel.email;
  }

  var data = {
    "logged_in": logged_in,
    "email": email
  }

  res.render('index', data);
});

app.get("/hotel_signup", function(req, res){
  res.render('hotel_signup/index')
});

app.post('/hotel_signup', function(req, res){
  var data = req.body;
  console.log(data)
  bcrypt.hash(data.password, 10, function(err, hash){
     // console.log(data.email);
     //  console.log(hash);

    db.none(
      "INSERT INTO hotels (email, password_digest) VALUES ($1, $2)",
      [data.email, hash]
    ).then(function(){
      console.log('hotel created');
      res.render('hotel_profile/index', {'hotels': data});
    })
  });
})

app.post('/hotel_login', function(req, res){
  var data = req.body;
  console.log(data);
  db.one(
    "SELECT * FROM hotels WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.redirect('notfound')
  }).then(function(hotel){
    console.log(hotel)
    bcrypt.compare(data.password, hotel.password_digest, function(err, cmp){
      if(cmp){
        req.session.hotel = hotel;
        res.render('hotel_profile/index', {'hotels': data});
      } else {
        console.log('bcrypt failed')
        res.redirect('notfound');
      }
    });
  });
});


//
app.get("/about", function(req, res) {
  res.render('about/index')
});

app.get("/login", function(req, res) {
  res.render('login/index')
});

app.get("/signup", function(req, res) {
  res.render('signup4/index')
});

app.get("/hotel_login", function(req, res) {
  res.render('hotel_login/index')
});

app.get("/hotel_signup", function(req, res) {
  res.render('hotel_signup/index')
});

app.get("/hotel_contact", function(req, res) {
  res.render('hotel_contact/index')
});

app.get("/hotel_profile", function(req, res) {
  res.render('hotel_profile/index')
});

app.get("/profile", function(req, res) {
  var data = {
    "logged_in": logged_in,
    "email": email
  }
  res.render('profile/index', data)
});

app.get("/notfound", function(req, res) {
  res.render('notfound/index')
});

app.get("/chat", function(req, res) {
  res.render('chat/index')
});

app.get('/logout', function(req, res) {
  req.session.user=null;
  req.session.hotel=null;
  res.render('logout/index');
});
// app.post('/login', function(req, res) {
//   var data = req.body;

//   db.one(
//     "SELECT * FROM users WHERE email = $1", [data.email]
//   ).catch(function() {
//     res.send('Email/Password not found.')
//   }).then(function(user) {
//     bcrypt.compare(data.password, user.password_digest, function(err, cmp) {
//       if (cmp) {
//         req.session.user = user;
//         res.redirect('/my_account')
//       } else {
//         res.send('Email/Password not found.')
//       }
//     });
//   });
// });


