require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 1582;
const mongo_url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clusterdosyyat.uiw1vnd.mongodb.net/dosyyat?retryWrites=true&w=majority`;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cookieParser = require('cookie-parser');

const subjectsRoutes = require('./routes/subjectsRoute');
const usersRoutes = require('./routes/usersRoute');

const User = require('./models/userModel');

mongoose
  .connect(mongo_url)
  .then(() => console.log('Database connected.'))
  .catch((error) => console.log(error));

app.engine('ejs', ejsMate);

const sessionConfig = {
  secret: 'asercet',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/subjects', subjectsRoutes);
app.use('/secretSignInPath/6565', usersRoutes);

app.get('/', (req, res) => {
  res.send(
    '<title>Dosyyat - Home page</title><h1><a href="/subjects">Subjects</a></h1>'
  );
});

app.all('*', (req, res) => {
  res.render('error', {
    info: {
      title: 'Dosyyat - Error',
      currentUrl: req.originalUrl,
      error: {
        message: 'Page not found.'
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
