var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CILENT_SECRET,
  FACEBOOK_CLIENT_ID,
} = require('../config/key');

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CILENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, last_name, first_name, middle_name, email } = profile._json;
        const photo = profile.photos[0].value;

        const existUser = await User.findOne({
          $or: [{ 'facebook.id': id }, { email }],
        });

        if (existUser) {
          done(null, existUser);
        } else {
          const newUser = await new User({
            'facebook.id': id,
            email,
            fristName: last_name,
            lastName: `${middle_name} ${first_name}`,
            photo,
          }).save({ validateBeforeSave: false });
          done(null, newUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, email, given_name, family_name, picture } = profile._json;
        const existUser = await User.findOne({
          $or: [{ 'google.id': id }, { email }],
        });

        if (existUser) {
          done(null, existUser);
        } else {
          const newUser = await new User({
            'google.id': id,
            email,
            fristName: family_name,
            lastName: given_name,
            photo: picture,
          }).save({ validateBeforeSave: false });
          done(null, newUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
