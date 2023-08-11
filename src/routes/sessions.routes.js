//Module imports
import passport from "passport";
import { Router } from "express";

const router = Router();

//File imports
import { current, logout, login, register, forgotPassword, resetPassword } from "../dao/controllers/sesssion.controller.js";
import { validateLogin, validateUser, validateNewPassword } from "../middlewares/validations.js";

router.post('/register', register);

router.post('/login', validateLogin, login);

router.get('/logout', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), logout);

router.get('/current', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), current);

router.post('/forgot-password', validateUser, forgotPassword);

router.post('/reset-password', validateNewPassword, resetPassword);

export default router;