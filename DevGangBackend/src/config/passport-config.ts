import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User'; // Adjust the import based on actual path and export

export interface UserType {
  _id?: string; // Assuming your user objects include an _id (optional)
  username: string; // Add other user properties as needed
  password?: string; // User's hashed password (optional if not needed in all contexts)
  email?: string; // User's email address
  fullName?: string; // User's full name
  createdAt?: Date; // Date the user account was created
  updatedAt?: Date; // Date the user account was last updated
  isActive?: boolean; // Flag indicating if the user's account is active
  roles?: string[]; // Roles or permissions assigned to the user
  profilePictureUrl?: string; // URL to the user's profile picture
}

export default function(passport: PassportStatic): void {
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await User.findOne({ username });
          if (user) {
            return done(null, false, { message: 'Username is already taken.' });
          }
          const newUser = new User();
          newUser.username = username;
          newUser.password = password;
          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await User.findOne({ username });
          if (!user) {
            return done(null, false, { message: 'No user found.' });
          }
          user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { message: 'Wrong password.' });
            return done(null, user);
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser<IUser>((user, done) => {
    done(null, (user as any).id);
  });

  passport.deserializeUser<IUser>(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
