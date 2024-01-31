const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
const { getAuthToken } = require('../utilFunctions/generateToken')

const validateInput = (input) => {
  const errors = [];

  /* if (!input.userid || typeof input.userid !== "string") {
    errors.push("userid is required and must be a string.");
  } */
  console.log(typeof input.lastName)
  if (!input.firstName || typeof input.firstName !== "string") {
    errors.push("firstName is required and must be a string.");
  }

  if (!input.lastName || typeof input.lastName !== "string") {
    errors.push("lastName is required and must be a string.");
  }

  if (!input.dateOfBirth || input.dateOfBirth.match(dateFormatRegex)) {
    errors.push("dateOfBirth is required and must be in the 'YYYY-MM-DD' format.");
  }

  if (!input.height || isNaN(Number(input.height))) {
    errors.push("height is required and must be a valid number.");
  }

  if (!input.weight || isNaN(Number(input.weight))) {
    errors.push("weight is required and must be a valid number.");
  }



  // Add more validation as needed for other attributes

  return errors;
};

const hashPassword = async (plainTextPassword) => {
  //const saltRounds=10;
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainTextPassword, salt);
};

const hello = async (event) => {

  try{

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const { firstName, lastName, email,dateOfBirth, height, weight, password } = JSON.parse(event.body)
  const userid = v4();
  
  console.log("This is an id",userid)

  const user = {userid, firstName, lastName, email, dateOfBirth, password, height, weight}  

  const validationErrors = validateInput(user);

  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: validationErrors }),
      
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing." }),
    };
  }

  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;


  await dynamodb.put({
    TableName: "UserDetails",
    Item: user
  }).promise();

  const token = getAuthToken(user)

  /*return {
    statusCode: 200,
    body: JSON.stringify(user),
    
  };*/

  console.log(user)

  return {
    statusCode: 200,
    body: JSON.stringify({"userToken":token}),
    
  };

}catch(error){

  console.error("Error in Lambda function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),

}
};
}
module.exports = {
  handler: hello
}
