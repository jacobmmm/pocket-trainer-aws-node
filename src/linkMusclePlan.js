const { v4 } = require("uuid");
const AWS = require('aws-sdk');
const { auth } = require('../utilFunctions/auth')

const linkMusclePlan = async (event) => {
    // Initialize DynamoDB client
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      httpOptions: {
        timeout: 5000
      }},
      {
          maxRetries: 3
        }
    );

    const { muscle_plan } = event.pathParameters;
    console.log("path parameter: ",muscle_plan)

    let musclePlans;
    let users;
    

    try{
        results = await dynamodb.scan({TableName:"MuscleBuildPlansV2"}).promise()
        musclePlans = results.Items
        console.log(musclePlans)
    }catch (error) {
        console.log(error)
    }
  
    const musclePlanDetails = musclePlans.find(muscPlan => muscPlan.muscle_plan_name === muscle_plan);
    
    console.log(musclePlanDetails)

    let musclePlanId;
  
  if (musclePlanDetails) {
    musclePlanId = musclePlanDetails.muscle_plan_id;
    console.log('Muscle Plan ID for ',muscle_plan  ,':', musclePlanId);
  } else {
    console.log('Submuscle not found.');
  }

  

  const decodUser = await auth(event);
  console.log("returned user ",decodUser)
  const username = decodUser.userName;
  console.log("Extracted Username: ",username);


  try{
    results = await dynamodb.scan({TableName:"UserDetails"}).promise()
    users = results.Items
    console.log(users)
    }catch (error) {
        console.log(error)
    }

    const userDetails = users.find(ud => ud.email === username);

    console.log(userDetails)

    let userId;

    if (userDetails) {
    userId = userDetails.userid;
    console.log('User ID for ',decodUser  ,':', userId);
    } else {
    console.log('User not found.');
    }

    const musclePlanUserId = v4();

    const musclePlanUser = {muscle_plan_user_id:musclePlanUserId, user_id:userId,muscle_plan_id:musclePlanId}

    await dynamodb.put({
        TableName: "MusclePlanUser2",
        Item: musclePlanUser
      }).promise();

  }

  module.exports = {
    handler: linkMusclePlan
  }