'use strict'
const bcrypt = require('bcryptjs');
const db = require('../models')
const customer = db.user;
const customError = require('../utils/error.helpers');
const createToken = require('../utils/jwt');
class customerService{
    async register(data){
    try{
        const currentCustomer = customer.findAll({'email':data.email})
        if(currentCustomer.length>0){
            throw new customError({
                name: "RegistrationError",
                status: 400,
                code: "AUT_00",
                message: "a customer with this email already exist",
                field: "email"
            })
        }

        const hashedPassword = await bcrypt.hash(data.password, 8);
        data.password = hashedPassword
        customer.create(data)
        newCustomer = await customer.findAll({'email':data.email});
        const token = createToken({id:newCustomer.userId, email:newCustomer.email, username:newCustomer.username});
        const response = {
            customer: newCustomer,
            accessToken: token,
            expires_in: '24h'
        }
        return response;
        }

        catch (error){
            throw error;
    }
    
}
}


module.exports = customerService;