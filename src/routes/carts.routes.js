//Module imports
import { Router } from 'express';
import passport from "passport";

const router = Router();

//File imports
import { addToCart, createCart, deleteFromCart, emptyCart, getCart, replaceCart, updateProductQty, purchaseCart } from '../dao/controllers/cart.controller.js';
import { validateCart, validateProduct, validateQuantity, validateCartContent, validateUserById } from '../middlewares/validations.js';

router.get('/:cid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateCart, getCart);

router.put('/:cid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateCart, replaceCart);

router.delete('/:cid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateCart, emptyCart);

router.post('/:uid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateUserById, createCart);

router.post('/:cid/product/:pid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateCart, validateProduct, addToCart);

router.put('/:cid/product/:pid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateCart, validateProduct, validateQuantity, updateProductQty);

router.delete('/:cid/product/:pid', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), validateCart, validateProduct, validateCartContent, deleteFromCart);

router.post('/:cid/purchase', passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), purchaseCart);

export default router;