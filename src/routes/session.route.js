import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Ruta para registro
router.post(
  '/register',
  passport.authenticate('register', {
    passReqToCallback: true,
    session: false,
    failureRedirect: "api/sessions/failedRegister",
    failureMessage: true,
  }),
  (req, res) => {
    res.send({
      status: 'success',
      message: 'User registered',
      payload: req.user._id,
    });
  }
);

// Ruta para inicio de sesión
router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/api/sessions/failedLogin',
    session: false,
  }),
  (req, res) => {
    const serializedUser = {
      id: req.user._id,
      name: `${req.user.first_name} ${req.user.last_name}`,
      role: req.user.role,
      email: req.user.email,
      age: req.user.age,
    };
    const token = jwt.sign(serializedUser, "CoderKeyQueNadieDebeSaber", {
      expiresIn: "1h",
    });
    res
      .cookie("coderCookie", token, { maxAge: 3600000, httpOnly: true })
      .send({ status: "success", payload: serializedUser });
  }
);

export default router;