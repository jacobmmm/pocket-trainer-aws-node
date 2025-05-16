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

    // Query DynamoDB to find the user with the given email

    // Query DynamoDB to find the user with the given username
    // const params = {
    //   TableName,
    //   KeyConditionExpression: 'userid = :userid',
    //   ExpressionAttributeValues: {
    //     ':userid': username,
    //   },
    // };

    const userResults = await dynamodb.scan({TableName:"UserDetails"}).promise();
    const users = userResults.Items
    console.log("User Details Queried:",users);
    //console.log("Result:",result)

    const userDetails = users.find(user => user.email === username);

    // Check if a user with the given username was found
    if (!userDetails) {

      console.log("No user queried")  
      return {
        statusCode: 400, // Unauthorized
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Verify the password using bcrypt
    //const user = userDetails.email;
    console.log("User:",userDetails)
    const passwordMatch = await bcrypt.compare(password, userDetails.password);
    
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
