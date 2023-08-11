//DB classes
import { CartMongo } from "./mongo/cart.mongo.js";
import { UserMongo } from "./mongo/user.mongo.js";
import { ProductMongo } from "./mongo/product.mongo.js";
import { MessageMongo } from "./mongo/message.mongo.js";
import { ViewMongo } from "./mongo/view.mongo.js";
//Filesystem classes
import { CartFs } from "./fs/cart.fs.js";
import { UserFs } from "./fs/user.fs.js";
import { ProductFs } from "./fs/product.fs.js";
import { MessageFs } from "./fs/message.fs.js";
import { ViewFs } from "./fs/view.fs.js";
//Memory classes


import { config } from "../config/environment.config.js"

let cartDao;
let userDao;
let productDao;
let messageDao;
let viewDao;

switch (config.persistence.type) {

    case "db":

        cartDao = new CartMongo();
        userDao = new UserMongo();
        productDao = new ProductMongo();
        messageDao = new MessageMongo();
        viewDao = new ViewMongo();

    break;

    default:

        cartDao = new CartMongo();
        userDao = new UserMongo();
        productDao = new ProductMongo();
        messageDao = new MessageMongo();
        viewDao = new ViewMongo();

    break;
}

export { cartDao, userDao, productDao, messageDao, viewDao };