const AWS = require('aws-sdk');
const { auth } = require('../utilFunctions/auth')
const { fetchTable } = require('../utilFunctions/getTable')

const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 3
      }
  );

const fetchPlanDetails = async (event) => {

    const {musclePlan} = JSON.parse(event.body);

    let tables = await fetchTable(event,dynamodb,"PlanMuscle");

    const planMuscle = tables.filter(pm => pm.muscle_plan_name === musclePlan);
    
    console.log("Plan Muscle Details: ",planMuscle);
    




}

module.exports = {
    handler: fetchPlanDetails
  }