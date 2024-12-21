const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addMusclePlans = async (event) => {

    const tableName = 'MuscleBuildPlansV2'; // Replace with your DynamoDB table name

    // Sample array of objects to insert
    const plans = ['ISOLATION (5 day)','ISOLATION (4 day)','PUSH-PULL','FULL BODY'];

    const dynamodb = new AWS.DynamoDB.DocumentClient()

    const insertItem = async (plan) => {
        const muscle_group_id = v4();
        const planItem ={muscle_plan_id:muscle_group_id,muscle_plan_name:plan}
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

      for (const plan of plans) {
        await insertItem(plan);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({Message: 'Success'}),
        
      };

 
}

module.exports = {
  handler: addMusclePlans
}
