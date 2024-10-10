const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName = 'UserDetails';

const login = async (event) => {
  try {
    console.log("Loggin in")
    const { username, password } = JSON.parse(event.body);
    console.log("username:",username,"password:",password);

    // Query DynamoDB to find the user with the given username

    const params = {
      TableName:TableName,
      FilterExpression: "email=:email",
      ExpressionAttributeValues: {  ':email': username,
      },
    };


    // const params = {
    //   TableName,
    //   KeyConditionExpression: 'userid = :userid',
    //   ExpressionAttributeValues: {
    //     ':userid': username,
    //   },
    // };
    const result = await dynamodb.scan(params).promise();
    // const result = await dynamodb.query(params).promise();
    console.log("User Queried")
    console.log("Result:",result)

    // Check if a user with the given username was found
    if (result.Items.length === 0) {

      console.log("No user queried")  
      return {
        statusCode: 400, // Unauthorized
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Verify the password using bcrypt
    const user = result.Items[0];
    console.log("User:",user)
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    console.log("Password comparison done")

    if (!passwordMatch) {
      console.log("Passwords dont match")  
      return {
        statusCode: 401, // Unauthorized
        body: JSON.stringify({ message: 'Invalid password' }),
      };
    }

    // Password is correct, return success
    console.log("Passwords match")
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ error: error.message/*'Internal Server Error'*/ }),
    };
  }
};

module.exports = {
    handler: login
  }
