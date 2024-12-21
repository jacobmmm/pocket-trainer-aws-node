const AWS = require('aws-sdk');
const { auth } = require('../utilFunctions/auth')
const { v4 } = require("uuid")

const linkUserPlanSubMuscle = async (event) => {
    // Initialize DynamoDB client
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      httpOptions: {
        timeout: 5000
      }},
      {
          maxRetries: 3
        }
    );

    const { username,muscle_plan_name, submuscles } = JSON.parse(event.body)


    //Extracting user ID
    // const decodUser = await auth(event);
    // console.log("returned user ",decodUser)
    // const username = decodUser.userName;
    // console.log("Extracted Username: ",username);
  
  
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
      console.log('User ID for :', userId);
      } else {
      console.log('User not found.');
      }

    //Muscle Plan ID

    let musclePlans;
    let musclePlanUsers;
    let musclePlanUserId
    let subMuscles;
    let subMuscleValues;

    try{
        results = await dynamodb.scan({TableName:"MuscleBuildPlansV2"}).promise()
        musclePlans = results.Items
        console.log(musclePlans)
    }catch (error) {
        console.log(error)
    }
  
    const musclePlanDetails = musclePlans.find(muscPlan => muscPlan.muscle_plan_name === muscle_plan_name);
    
    console.log(musclePlanDetails)

    let musclePlanId;
  
    if (musclePlanDetails) {
        musclePlanId = musclePlanDetails.muscle_plan_id;
        console.log('Muscle Plan ID for ',muscle_plan_name  ,':', musclePlanId);
    } else {
        console.log('Submuscle not found.');
    }

    // try{
    //     results = await dynamodb.scan({TableName:"MusclePlanUser2"}).promise()
    //     musclePlanUsers = results.Items
    //     console.log(musclePlanUsers)
    // }catch (error) {
    //     console.log(error)
    // }
  
    // const musclePlanUserDetails = musclePlanUsers.find(muscPlanUser => (muscPlanUser.muscle_plan_id === musclePlanId && muscPlanUser.user_id === userId ));
    
    // console.log(musclePlanUserDetails)

    // let musclePlanUserId;
  
    // if (musclePlanUserDetails) {
    //     musclePlanUserId = musclePlanUserDetails.muscle_plan_user_id;
    //     console.log('Muscle Plan User ID for ',muscle_plan_name  ,"and ",userId,' :', musclePlanUserId);
    // } else {
    //     console.log('MusclePlanUser not found.');
    // }

    
    subMuscleValues = Object.values(submuscles)
    subMuscleValues = subMuscleValues.flat();
    console.log("Submuscles alone: ", subMuscleValues)
    



    for (var i = 0; i < subMuscleValues.length; i++) {
        
        try{
            results = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
            subMuscles = results.Items
            console.log(subMuscles)
            }catch (error) {
                console.log(error)
            }

            console.log("SubMuscle at position ",(i+1)," :", subMuscleValues[i])
        
            const subMuscDetails = subMuscles.find(subMusc => subMusc.muscle_subgroup_name === subMuscleValues[i]);
        
            console.log(subMuscDetails)
        
            let subMuscleId;
        
            if (subMuscDetails) {
                subMuscleId = subMuscDetails.muscle_subgroup_id;
                console.log('subMuscle ID for ',subMuscDetails  ,':', subMuscleId);
                } else {
                console.log('subMuscle not found.');
                }

            musclePlanUserId = v4();

            const musclePlanUserSubMusc = { muscle_plan_user_id:musclePlanUserId, userId:userId, muscle_subgroup_id:subMuscleId}

            await dynamodb.put({
                TableName: "MusclePlanUserSubMuscle2",
                Item: musclePlanUserSubMusc
              }).promise();

            console.log(musclePlanUserSubMusc," Inserted Successfully");

            
            

    }

    return {
        statusCode: 200,
        body: JSON.stringify({status:"Created UserPlanSubMuscleEntity"}),
        };

    




}

module.exports = {
    handler: linkUserPlanSubMuscle
}