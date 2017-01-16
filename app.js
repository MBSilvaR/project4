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


// var db = pgp(process.env.DATABASE_URL || 'postgres://marcelasilva@localhost:5432/art_crud');

app.listen(port)
console.log("Server started on " + port);


app.get("/", function(req, res, next) {
  res.render('home/index');
});

// app.post('/', function(req, res) {
//   var data = req.body;

//   bcrypt.hash(data.password, 10, function(err, hash) {
//     db.none(
//       "INSERT INTO users (email, password_digest) VALUES ($1, $2)", [data.email, hash]
//     ).then(function() {
//       res.render('my_account/index');
//     })
//   });
// })



app.get("/login", function(req, res) {
  res.render('login/index')
});

app.get("/hotel_contact", function(req, res) {
  res.render('hotel_contact/index')
});

app.get("/my_account", function(req, res) {
  res.render('my_account/index')
});

app.get("/chat", function(req, res) {
  res.render('chat/index')
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


