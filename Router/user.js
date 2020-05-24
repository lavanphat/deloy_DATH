const express = require('express');
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  changePassword,
  checkLogin,
  auth,
  signInSocial,
} = require('../Controller/Auth');
const {
  updateMe,
  deleteMe,
  getMe,
  getUser,
  addFavoriteCourse,
  removeFavoriteCourse,
} = require('../Controller/User');
const passport = require('passport');
require('../helper/passport');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', checkLogin, changePassword);

router.put('/update-me', checkLogin, updateMe);
router.delete('/delete-me', checkLogin, deleteMe);
router.patch('/add-favorite', checkLogin, addFavoriteCourse);
router.delete('/remove-favorite', checkLogin, removeFavoriteCourse);
router.get('/me', checkLogin, getMe, getUser);
router.get('/auth', auth);
router.post(
  '/auth/google',
  passport.authenticate('google-token', { session: false }),
  signInSocial
);
router.post(
  '/auth/facebook',
  passport.authenticate('facebook-token', { session: false }),
  signInSocial
);

module.exports = router;
