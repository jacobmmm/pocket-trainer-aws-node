const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addSubMuscles = async (event) => {

  try{

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const { muscle_group_id, muscle_subgroup_name } = JSON.parse(event.body)
  const muscle_subgroup_id = v4();
  
  console.log("Muscle SubGroup ID: ",muscle_subgroup_id)

  const muscleSubGroup = {muscle_subgroup_id,muscle_group_id, muscle_subgroup_name}  

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
    TableName: "MuscleSubGroup",
    Item: muscleSubGroup
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(muscleSubGroup),
    
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
  handler: addSubMuscles
}
