const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addSubPlan = async (event) => {

    const tableName = 'MuscleSubPlan'; // Replace with your DynamoDB table name

    // Sample array of objects to insert
    const subplans = ['Push','Pull'];

    const dynamodb = new AWS.DynamoDB.DocumentClient()

    const insertItem = async (subplan) => {
        const muscle_subplan_id = v4();
        const planItem ={muscle_subplan_id:muscle_subplan_id,muscle_subplan_name:subplan}
        const params = {
          TableName: tableName,
          Item: planItem,
        };
      
        try {
          await dynamodb.put(params).promise();
          console.log(`Successfully inserted plan:`, planItem);
        } catch (error) {
          console.error(`Error inserting plan:`, planItem, error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: error }),
      
      }
        }
      };

      for (const subplan of subplans) {
        await insertItem(subplan);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({Message: 'Success'}),
        
      };

 
}

module.exports = {
  handler: addSubPlan
}
