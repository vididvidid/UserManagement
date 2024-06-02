import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';
import generateUserId from '../utils/generateUserId';
dotenv.config();
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}, async (token: string, tokenSecret: string, profile: Profile, done: VerifyCallback) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      const email = profile.emails ? profile.emails[0].value : undefined;
      const firstname = profile.name?.givenName;
      const lastname = profile.name?.familyName;
      const userId = await generateUserId();
      user = new User({
        userid: userId,
        googleId: profile.id,
        email,
        firstname,
        lastname,
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err as Error, undefined);
  }
}));

export default passport;
