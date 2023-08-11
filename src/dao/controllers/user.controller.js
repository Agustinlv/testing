//File imports
import { userDao } from "../dao.js";

export const toggleRole = async(req, res) => {

    const response = await userDao.toggleRole(req.params.uid);
    
    return res.status(response.code).send({
        status: response.status,
        message: response.message
    });

};

export const getUsers = async(req, res) => {

    const response = await userDao.getUsers();

    return res.status(response.code).send({
        status: response.status,
        message: response.message
    });

};