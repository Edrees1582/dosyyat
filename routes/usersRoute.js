const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  signupForm,
  signup,
  signinForm,
  signout,
} = require('../controllers/usersController');

const { isSignedIn, isSignedOut } = require('../middleware');

router.route('/signup').get(isSignedOut, signupForm).post(isSignedOut, signup);

router
  .route('/signin')
  .get(isSignedOut, signinForm)
  .post(
    isSignedOut,
    passport.authenticate('local', {
      failureRedirect: '/secretSignInPath/6565/signin',
      successRedirect: '/subjects',
    })
  );

router.post('/signout', isSignedIn, signout);

module.exports = router;
