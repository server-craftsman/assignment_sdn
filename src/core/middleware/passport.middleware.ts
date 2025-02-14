import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../modules/user/user.model'; // Giả sử bạn có một mô hình User

// config local strategy
passport.use(new LocalStrategy(
  async (username: string, password: string, done: any) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: any, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
