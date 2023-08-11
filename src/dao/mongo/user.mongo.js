//File imports
import userModel from "../models/user.models.js";
import customLogger from '../../utils/logger.js';
import { UserDto } from "../../dto/user.dto.js";
import { CartMongo } from "./cart.mongo.js";
import { createHash } from '../../utils.js';
import { generateToken, generateEmailToken } from "../../utils/token.js";
import { loggerPrefix } from "../../utils/logger.js";
import { sendRecoveryPassword } from "../../utils/email.js";

const cartDao = new CartMongo();

const filename = 'user.mongo.js';

export class UserMongo{

    constructor(){
        this.model = userModel
    };

    async register(body){

        const { first_name, last_name, email, age, role, password } = body;

        const inUse = await this.model.findOne({email: email});

        if (inUse){

            customLogger.error(loggerPrefix(filename, 'The email is already in use'));

            return {
                code: 400,
                status: "Error",
                message: 'The email is already in use'
            };

        };

        const user = { first_name, last_name, email, age, role, password: createHash(password) };

        try {

            await this.model.create(user);

            customLogger.http(loggerPrefix(filename, 'User registered correctly'));

            return {
                code: 202,
                status: 'Success',
                message: 'User registered correctly'
            };

        } catch (error) {

            customLogger.error(loggerPrefix(filename, `${error.message}`));

            return{
                code: 400,
                status: "Error",
                message: error.message
            };

        };

    };

    async login(email){

        const user = await this.model.findOne({email: email});

        //Si es la primera vez que se loguea este usuario, creamos un cart y seteamos el user.cart    
        const response = await cartDao.createCart(user._id);

        user.cart = response.message._id;

        const userDto = new UserDto(user);

        const accessToken = generateToken(user, '1d');

        customLogger.http(loggerPrefix(filename, `User ${user._id} successfully logged in`));

        return{
            status: "Success",
            message: "You have succesfully logged in",
            user: userDto,
            token: accessToken,
        };

    };

    async forgotPassword(email){

        try {

            const resetToken = generateEmailToken(email, 180);

            await sendRecoveryPassword(email, resetToken);

            return{
                code: 202,
                status: "Success",
                message: "Password recovery email sent"
            };


        } catch (error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: "Error",
                message: error.message
            };

        };

    };

    async resetPassword(email, newPassword){

        try {

            const user = await this.model.findOne({email: email});

            const newUserData = {
                ...user._doc,
                password: createHash(newPassword)
            };

            await this.model.findOneAndUpdate({email: email}, newUserData);

            return{
                code: 200,
                status: "Success",
                message: "Password successfuly reset"
            };

        } catch (error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: "Error",
                message: error.message
            };

        };

    };

    async toggleRole(uid){

        try {

            const user = await userModel.findById(uid);
    
            const userRole = user.role;
    
            if (userRole === 'user') {
    
                user.role = 'premium';
    
            } else if (userRole === 'premium') {
    
                user.role = 'user';
    
            } else {
    
                return{
                    code: 400,
                    status: 'Error',
                    message: `Admin role can't be changed`
                };
    
            };
    
            await userModel.updateOne({_id: uid}, user);
    
            return {
                code: 200,
                status: 'Success',
                message: 'User role successfuly updated'
            };
    
        } catch (error) {
    
            return {
                code: 400,
                status: 'Error',
                message: error.message
            };
    
        };

    };

    async getUsers(){

        try {

            const users = await this.model.find();

            return{
                code: 200,
                status: "Success",
                message: users
            };

        } catch (error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: "Error",
                message: error.message
            };

        };

    };

};