import {fileURLToPath} from "url"; 
import { dirname } from "path";
import bcrypt from "bcrypt"
import passport from "passport";
import Jwt from "jsonwebtoken";

export  const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const isValidPassword = async (user, password) => {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) return next(error);
      console.log(user, info);
      if (!user)
        return res.status(401).json({
          error: "ha pasado algo",
        });
      user.role = "student";
      req.user = user;
      next();
    })(req, res, next);
  };
};