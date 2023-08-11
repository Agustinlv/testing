//Module imports
import { v4 as uuidv4 } from "uuid";
//File imports
import productModel from '../models/product.model.js';
import customLogger from "../../utils/logger.js";

const filename = 'product.mongo.js';

export class ProductMongo{

    constructor(){
        this.model = productModel
    };

    async getProducts(query){

        customLogger.debug(`${new Date().toLocaleDateString()}: ${query}`);

        const {limit = 10, page = 1, category, available, sort} = query;

        let paginateQuery = {};

        if (category) {

            if (available) {

                paginateQuery = {category: category, stock: { $gt: 0}}

            } else {

                paginateQuery = {category: category}

            };

        };

        try {

            const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await this.model.paginate(
                paginateQuery,
                {
                    limit: limit,
                    sort:{ price: sort },
                    page: page,
                    lean: true
                }
            );

            const payload = docs;

            const prevLink = hasPrevPage === false ? null : `/products?page=${prevPage}`;

            const nextLink = hasNextPage === false ? null : `/products?page=${nextPage}`;

            return{
                code: 200,
                status: "Succcess",
                payload: payload,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
                prevLink: prevLink,
                nextLink: nextLink
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

    async getProductByID(pid){

        try {

            customLogger.debug(`${new Date().toLocaleDateString()}: ${pid}`);

            const product = await this.model.findById(pid);

            return{
                code: 200,
                status: 'Success',
                message: product
            };

        } catch(error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: "Error",
                message: error.message
            };

        };

    };

    async addProduct(email, product){

        try {

            product.owner = email;

            product.code = uuidv4();

            customLogger.debug(`${new Date().toLocaleDateString()}: ${product}`);

            await this.model.create(product);

            return{
                code: 200,
                status: 'Success',
                message: `El producto ${product.title} ha sido agregado con éxito.`
            };

        } catch (error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: 'Error',
                message: error.message
            };

        };

    };

    async updateProduct(pid, updatedProduct){

        //Si el producto no existe, no hay nada para actualizar
        try {

            customLogger.debug(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${{pid: pid, updatedProduct: updatedProduct}}`);

            const productFound = await this.model.findById(pid);

            //Hago esto como para que no editen el product code accidentalmente
            updatedProduct.code = productFound.code;

            await productModel.findByIdAndUpdate(pid, updatedProduct);

            return{
                code: 200,
                status: 'Success',
                message: `El producto ${pid} ha sido actualizado con éxito`
            };

        } catch (error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: 'Error',
                message: error.message
            };

        };

    };

    async deleteProduct(pid){

        try {

            customLogger.debug(`${new Date().toLocaleDateString()}: ${pid}`);

            await this.model.findByIdAndDelete(pid);

            return{
                code: 200,
                status: 'Success',
                message: `El producto con ID ${pid} ha sido elminado exitosamente`
            };

        } catch(error) {

            customLogger.error(`Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${error.message}`);

            return{
                code: 400,
                status: 'Error',
                message: error.message
            };

        };

    };

};