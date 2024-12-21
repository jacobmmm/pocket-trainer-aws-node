const jwt = require('jsonwebtoken')
const config = require('config')


const getAuthToken = function(object){
    console.log("jwtKey: ", config.get('jwtPrivateKey'))
    const token = jwt.sign({userId: object.userId,userName:object.email}, config.get('jwtPrivateKey'))
    return token;
}


exports.getAuthToken = getAuthToken;

