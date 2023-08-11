//Module imports
import productModel from "../dao/models/product.model.js";
import { connectDB } from "../config/dbConnection.js";
//File imports
import customLogger from "../utils/logger.js";

const updateProducts = async() => {

    try {

        const adminID = "id del admin";

        const result = await productModel.updateMany({},{$set: {owner: adminID}});


    } catch (error) {

        customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: mongo.script.js - Message: ${error.message}`);

    };

}