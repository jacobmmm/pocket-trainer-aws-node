const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addMuscles = async (event) => {

  try{
  
  const muscles = ['Legs','Shoulders','Back','Biceps','Triceps','Chest'];

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const tableName = 'MuscleGroup';

  const insertItem = async (muscle) => {
    const muscle_group_id = v4();
    const muscleItem ={muscle_group_id:muscle_group_id,muscle_group_name:muscle}
    const params = {
      TableName: tableName,
      Item: muscleItem,
    };
  
    try {
      await dynamodb.put(params).promise();
      console.log(`Successfully inserted plan:`, muscleItem);
    } catch (error) {
      console.error(`Error inserting plan:`, muscleItem, error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error }),
  
  }
    }
  };

  for (const muscle of muscles) {
    await insertItem(muscle);
  }  



  return {
    statusCode: 200,
    body: JSON.stringify({Message:"Success"}),
    
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
