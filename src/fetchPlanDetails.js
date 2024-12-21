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

    const planDetails = tables.filter(pm => pm.muscle_plan_name === musclePlan);
    
    console.log("Plan Muscle Details: ",planDetails);

    let planMuscles = planDetails.map(pm => pm.muscle_group_name);

    console.log("Muscles extracted: ",planMuscles)

    let cardioIndex = planMuscles.findIndex(pm => pm.toLowerCase() === 'cardio');
    console.log("Cardio is found at position: ",cardioIndex)

    if (cardioIndex !== -1) {
      console.log("Cardio present in plan")
      let cardio = planMuscles.splice(cardioIndex, 1); 
      planMuscles.push(cardio[0]);               
  }

  if (planMuscles.length < 5) {
    let m = 5 - planMuscles.length; // Number of elements to add 3
    console.log("m ",m)
    let elementsXtra = []
    if(planMuscles.length < m){
      let x = m - planMuscles.length;
      console.log("x ",x)
      elementsXtra = planMuscles.slice(0, x);
      
    }
    let elementsToAdd = planMuscles.slice(0, m);
    planMuscles = planMuscles.concat(elementsToAdd);
    if(elementsXtra){
      planMuscles = planMuscles.concat(elementsXtra);
    }
    
    //planMuscles = planMuscles.concat(elementsXtra);
     // Get the first `m` elements from the array (0,3)
    
     // Append these elements to the end
}

console.log("Final List of muscles: ",planMuscles);

    return {
      statusCode: 200,
      body: JSON.stringify({"Muscles ":planMuscles})
      
    };
    




}

module.exports = {
    handler: fetchPlanDetails
  }