const jwt = require('jsonwebtoken')
const config = require('config')


const getAuthToken = function(object){
    const token = jwt.sign({userId: object.userId,userName:object.userName}, config.get('jwtPrivateKey'))
    return token;
}


exports.getAuthToken = getAuthToken;

