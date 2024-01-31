const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addExcercises = async (event) => {

  try{

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const { muscle_subgroup_id, muscle_subplan_id, excercise_name } = JSON.parse(event.body)
  const excercise_id = v4();
  
  console.log("Muscle SubGroup ID: ",excercise_id)

  const excercise = {excercise_id, muscle_subgroup_id, muscle_subplan_id, excercise_name}  

  /*const validationErrors = validateInput(user);

  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: validationErrors }),
      
    };
  }*/

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing." }),
    };
  }

  /*const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;*/


  await dynamodb.put({
    TableName: "Excercises",
    Item: excercise
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(excercise),
    
  };
}catch(error){

  console.error("Error in Lambda function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),

}
};
}

module.exports = {
  handler: addExcercises
}
