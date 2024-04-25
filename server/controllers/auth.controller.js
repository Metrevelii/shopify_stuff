const { authService } = require('../services');
const httpStatus = require('http-status');

const authController = {
    async register(req, res, next) {
        try {
            const {email, password } = req.body;
            const user = await authService.createUser(email, password);

            // generate token
            const token = await  authService.genAuthToken(user);

            // send register email


            res.cookie('x-access-token', token).status(httpStatus.CREATED).send({
                user,
                token
            })


        } catch (error) {
   
            next(error);
        }
    },
    async signin(req, res, next) {
        try {

        } catch (error) {
            console.log(error);
        }
    },
    async isauth(req, res, next) {
        try {

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = authController;