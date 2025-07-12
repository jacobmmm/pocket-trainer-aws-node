const AWS = require('aws-sdk');
const { auth } = require('../utilFunctions/auth')
const { fetchUserId } = require("../utilFunctions/getUserId")


const fetchUserPlan = async (event) => {
  // Initialize DynamoDB client
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 3
      }
  );

  // Access specific query parameters
  const { userEmail } =  event.pathParameters; // Replace 'paramName' with your actual parameter name
  
  console.log("UserEmail in fetch userPlans:", userEmail);
  

  const userId = await fetchUserId(event,dynamodb,userEmail);
  console.log("UserId returned value: ",userId)
  let musclePlanUsers;
  let musclePlans;



  try{
    results = await dynamodb.scan({TableName:"MusclePlanUserSubMuscle3"}).promise()
    musclePlanUsers = results.Items
    console.log(musclePlanUsers)
    }catch (error) {
        console.log(error)
    }

    const musclePlanUserDetails = musclePlanUsers.filter(mpud => mpud.userId === userId);
  
    console.log("musclePlanUserDetails:", musclePlanUserDetails)

    const userPlanIds = musclePlanUserDetails.map(obj => obj.musclePlanId);

    console.log("Users plan IDs: ",userPlanIds)

    let userPlanNames = [];

    try{
      results = await dynamodb.scan({TableName:"MuscleBuildPlansV2"}).promise()
      musclePlans = results.Items
      console.log("Extracted Muscle Plans:",musclePlans)
      }catch (error) {
          console.log(error)
      }

    for (var i = 0; i < userPlanIds.length; i++) {
        
      

          console.log("Plan ID at position ",(i+1)," :", userPlanIds[i])
      
          const planDetails = musclePlans.find(muscPlan => muscPlan.muscle_plan_id === userPlanIds[i]);
      
          console.log(planDetails)
      
          let planName;
          
      
          if (planDetails) {
              planName = planDetails.muscle_plan_name;
              console.log('Plan Name for ',planDetails  ,':', planName);
              userPlanNames[i] = planName;
              } else {
              console.log('Plan not found.');
              }

          console.log("User Plan Name ",(i+1)," :",userPlanNames[i])

          
          

  }

  const uniquePlan = [...new Set(userPlanNames)];
  console.log("Unique Plan Names: ",uniquePlan)

// If you want to also remove null/undefined values
  const cleanUniquePlan = uniquePlan.filter(Boolean);

  return {
    statusCode: 200,
    body: JSON.stringify({plans:cleanUniquePlan})
    
  };



}

module.exports = {
  handler: fetchUserPlan
}