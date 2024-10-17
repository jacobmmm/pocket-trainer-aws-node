const AWS = require('aws-sdk');
const { auth } = require('../utilFunctions/auth')
const { fetchTable } = require('../utilFunctions/getTable')
const { fetchUserId } = require('../utilFunctions/getUserId')

const displayMuscleExcercise = async (event) => {
    // Initialize DynamoDB client
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      httpOptions: {
        timeout: 5000
      }},
      {
          maxRetries: 3
        }
    );

    const userId = await fetchUserId(event,dynamodb);
    console.log("UserId returned value: ",userId)

    const { muscle_plan_name } = JSON.parse(event.body);
    const { muscle_group } = event.pathParameters;
    console.log("Extracted Muscle Plan Name: ",muscle_plan_name);

    const muscle_subplans = ["PUSH", "PULL"]
    //let subPlanId;
    let planId;
    let planUserId;
    let muscleId;
    let tables;
    let tableRows = [];
    let muscleExc = [];

     try{
        results = await dynamodb.scan({TableName:"MuscleBuildPlansV2"}).promise()
        tableRows = results.Items
        console.log(tableRows)
        }catch (error) {
        console.log(error)
        }
        
        const musclePlanDetails = tableRows.find(obj => obj.muscle_plan_name === muscle_plan_name);
        
        console.log("MusclePlan Details: ",musclePlanDetails);
        
        
        if (musclePlanDetails) {
            planId = musclePlanDetails.muscle_plan_id;
            console.log('Plan ID for: ',musclePlanDetails  ,':', planId);
        } 
        else {
            console.log('Muscle not found.');
          
        }  
    
    if((muscle_plan_name == "PUSH PULL" && !muscle_subplans.includes(muscle_group)) || (muscle_plan_name != "PUSH PULL" && muscle_subplans.includes(muscle_group)) ){
        return {
            statusCode: 401, // Unauthorized
            body: JSON.stringify({ message: 'Invalid muscle group' }),
          };
    }

    try{
        results = await dynamodb.scan({TableName:"MusclePlanUser2"}).promise()
        tableRows = results.Items
        console.log(tableRows)
        }catch (error) {
        console.log(error)
        }
        
        const musclePlanUserDetails = tableRows.find(mpu => mpu.muscle_plan_id === planId && mpu.user_id === userId);
        
        console.log("MusclePlanUser Details: ",musclePlanUserDetails);
        
        
        if (musclePlanUserDetails) {
            planUserId = musclePlanUserDetails.muscle_plan_user_id;
            console.log('Plan User ID for: ',musclePlanDetails  ,':', planUserId);
        } 
        else {
            console.log('Plan User ID not found.');
          
        }

    
    if(muscle_subplans.includes(muscle_group) ){

        try{
            results = await dynamodb.scan({TableName:"MuscleSubPlan"}).promise()
            tableRows = results.Items
            console.log(tableRows)
            }catch (error) {
            console.log(error)
            }
            
            const subPlanDetails = tableRows.find(subp => subp.muscle_subplan_name === muscle_group);
            
            console.log("SubPlan Details: ",subPlanDetails);
            
            
            if (subPlanDetails) {
                muscleId = subPlanDetails.muscle_subplan_id;
                console.log('SubPlan ID for: ',subPlanDetails  ,':', muscleId);
            } 
            else {
                console.log('Sub Plan ID not found.');
              
            }
        }

    else{

        try{
            results = await dynamodb.scan({TableName:"MuscleGroup"}).promise()
            tableRows = results.Items
            console.log(tableRows)
            }catch (error) {
            console.log(error)
            }
            
            const muscleDetails = tableRows.find(musc => musc.muscle_group_name === muscle_group);
            
            console.log("Muscle Details: ",muscleDetails);
            
            
            if (muscleDetails) {
                muscleId = muscleDetails.muscle_group_id;
                console.log('Muscle ID for: ',muscleDetails  ,':', muscleId);
            } 
            else {
                console.log('Muscle ID not found.');
              
            }

    }

    try{
        tables = await fetchTable(event,dynamodb,"MusclePlanUserSubMuscle2");

    }catch (error) {
    console.log("Error extracting table: ",error);
    }

    const planUserSubMuscDetails = tables.filter(mpusub => mpusub.muscle_plan_user_id === planUserId);
  
    console.log(planUserSubMuscDetails);

    const subMuscleIds = planUserSubMuscDetails.map(obj => obj.muscle_subgroup_id);

    console.log("subMuscle IDs: ",subMuscleIds);

    let counter = 0;
    

    for (var i = 0; i < subMuscleIds.length; i++) {

        console.log("SubMuscle at position ",(i+1),": ", subMuscleIds[i]);

        tables = await fetchTable(event,dynamodb,"MuscleSubGroup");
    
        const subMuscDetails = tables.find(submusc => submusc.muscle_subgroup_id === subMuscleIds[i]);
  
        console.log("SubMuscle Details at ",(i+1),": ",subMuscDetails);

        if((muscle_subplans.includes(muscle_group) && subMuscDetails.muscle_subplan_id === muscleId) || (subMuscDetails.muscle_group_id === muscleId) ){

            tables = await fetchTable(event,dynamodb,"Excercises"); 
            const excDetails = tables.find(exc => exc.muscle_subgroup_id === subMuscleIds[i]);

            if(excDetails){
                console.log("Detected Excercise Details: ",excDetails)
                console.log("Detected Excercise Name: ",excDetails.excercise_name);
                muscleExc[counter] = excDetails.excercise_name;
                console.log("Excercise inserted at ",counter,": ",muscleExc[counter]);
                counter+=1;
            }

        }

       

    
    
    
    }

    //let muscleGroup=muscle_group;

    return {
        statusCode: 200,
        body: JSON.stringify({[muscle_group]:muscleExc}),
        };




}

module.exports = {
    handler: displayMuscleExcercise
}
