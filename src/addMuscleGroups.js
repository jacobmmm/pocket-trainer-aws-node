const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addMuscles = async (event) => {

  try{

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const { muscle_group_name } = JSON.parse(event.body)
  const muscle_group_id = v4();
  
  console.log("Muscle Group ID:",muscle_group_id)

  const muscleGroup = {muscle_group_id, muscle_group_name}  

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
    TableName: "MuscleGroup",
    Item: muscleGroup
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(muscleGroup),
    
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
  handler: addMuscles
}
