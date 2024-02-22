import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import Users from "../dbmanager/dbmanager.js";
import { createHash, isValidPassword } from "../utils.js";

const users = new Users();

const initializePassport = async () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          if (!first_name || !last_name || !password || !age)
            return done(null, false, { message: "Incomplete values" });
          // si exixte
          const exists = await users.getUserById({ email: email });
          if (exists)
            return done(null, false, { message: "User already exists" });
          const hashedPassword = await createHash(password);
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
          };
          let result = await userService.saveUser(newUser);
          //SI TODO SALIÓ BIEN
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await users.getBy({ email });
          if (!user) return done(null, false, { messages: "No user found" });
          const passwordValidation = await isValidPassword(user, password);
          if (!passwordValidation)
            return done(null, false, { messages: "Incorrect password" });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderKeyQueNadieDebeSaber",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let result = await userService.findOne({ _id: id });
    return done(null, result);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookie"];
    console.log(token);
  }
  return token;
};

export default initializePassport;
