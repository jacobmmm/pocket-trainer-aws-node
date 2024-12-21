const jwt = require('jsonwebtoken');
const config = require('config');

let token;

async function auth(event){
    try{
    const headers = event.headers || {};
    token = headers['x-auth-token'];
    console.log("Extracted token ",token)
    }

    catch(error){
      console.log("Error extracting token ",error)
    }
    //if(!token) return res.status(401).send("Access denied. No token provided")

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        const user = decoded;
        console.log("Decoded user: ",user)
        return user
    }

    catch(error) {
        console.log("Error Decoding Token: ",error);
    }
    
}

exports.auth = auth;