const User = require('../models/userModel');

module.exports.signupForm = (req, res) => {
  res.render('users/signup', { info: { title: 'Dosyyat - Sign up' } });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body.users;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, (error) => {
      if (error) return next(error);
      res.redirect('/subjects');
    });
  } catch (error) {
    console.log(error);
    res.redirect('/signup');
  }
};

module.exports.signinForm = (req, res) => {
  res.render('users/signin', { info: { title: 'Dosyyat - Sign in' } });
};

module.exports.signout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect('/subjects');
  });
};
