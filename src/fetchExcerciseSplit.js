const AWS = require('aws-sdk');

//const { v4 } = require("uuid")

const fetchExcerciseSplit = async  (event) => { 

    const dynamodb = new AWS.DynamoDB.DocumentClient({
          httpOptions: {
            timeout: 5000
          }},
          {
              maxRetries: 3
            }
        );
    const { plan,excSplit,username } = JSON.parse(event.body);

    let planResults;
    let musclePlanId;
    let userResults;
    let userId;
    let userPlanResults;
    let splitResults;
    let splitId;
    let muscleGroupId;
    let splitSubgroupResults;
    let splitSubgroupIds = [];
    let muscleGroupSubgroupResults;
    let muscleGroupSubgroupIds = [];

    const subplans = ["Push","Pull","Full Body"]
    //const muscles = ["Legs","Back","Chest","Shoulders","Biceps","Triceps"]

    

    try{
        planResults = await dynamodb.scan({TableName:"MuscleBuildPlansV2",FilterExpression: "muscle_plan_name = :mpn",
                    ExpressionAttributeValues: {":mpn": plan}}).promise()

        console.log("planResults: ",planResults)

        musclePlanId = planResults.Items[0].muscle_plan_id;
        console.log("Muscle Plan ID for plan ",plan,": ",musclePlanId)

        

    }
    catch (error) {
        console.log("Error fetching MuscleBuildPlansV2:", error);
    }

    try{
        userResults = await dynamodb.scan({TableName:"UserDetails",FilterExpression: "email = :em",
                    ExpressionAttributeValues: {":em": username}}).promise()
        userId = userResults.Items[0].userid;
        console.log("User ID for username ",username,": ",userId)
    }
    catch (error) {
        console.log("Error fetching UserDetails:", error);
    }

    try{
        userPlanResults = await dynamodb.scan({TableName:"MusclePlanUserSubMuscle3",FilterExpression: "userId = :userId AND musclePlanId = :mpid",
                    ExpressionAttributeValues: {":userId": userId,":mpid":  musclePlanId}}).promise()

        console.log("UserPlanSubMuscDetails: ",userPlanResults.Items)

    }
    catch (error) {
        console.log("Error fetching UserPlanSubMuscDetails:", error);
    }

    // Extract muscle_subgroup_id from each object in the array
    let muscleSubgroupIds = [];
    if (userPlanResults && userPlanResults.Items && userPlanResults.Items.length > 0) {
        muscleSubgroupIds = userPlanResults.Items.map(item => item.muscle_subgroup_id);
        console.log("Extracted muscle_subgroup_ids: ", muscleSubgroupIds);
    }

    if(subplans.includes(excSplit)){
       
    
    try{
        splitResults = await dynamodb.scan({TableName:"MuscleSubPlan",FilterExpression: "muscle_subplan_name = :mspn",
                    ExpressionAttributeValues: {":mspn": excSplit}}).promise()

        console.log("splitResults for plan in subplans: ",splitResults)

        splitId = splitResults.Items[0].muscle_subplan_id;
        console.log("Muscle SubPlan ID for split ",excSplit,": ",splitId)


    }    catch (error) {
        console.log("Error processing SubPlan and SubGroups: ",error)
    }

    try{
        splitSubgroupResults = await dynamodb.scan({TableName:"SubplanSubgroup",FilterExpression: "muscle_subplan_id = :mspid",
                    ExpressionAttributeValues: {":mspid": splitId}}).promise()
        console.log("splitSubgroupResults: ",splitSubgroupResults)

         if (splitSubgroupResults && splitSubgroupResults.Items && splitSubgroupResults.Items.length > 0) {
        splitSubgroupIds = splitSubgroupResults.Items.map(item => item.muscle_subgroup_id);
        console.log("Extracted muscle_subgroup_ids: ", splitSubgroupIds);
    }

    }catch (error) {
        console.log("Error fetching SubplanSubgroup:", error);
    }

}
    else{

     let excSplits = [];
     //Extracting submuscles of two subgroups in case of ISOLATION (4 Day)   
     if(excSplit.includes("+"))   {
        excSplits = excSplit.split("+").map(s => s.trim());
    
     for (let es of excSplits){
        try{
       muscleGroupSubgroupResults = await dynamodb.scan({TableName:"MuscleGroup",FilterExpression: "muscle_group_name = :mgn",
                    ExpressionAttributeValues: {":mgn": es}}).promise()

        console.log("MuscleGroupResults for split with + : ",muscleGroupSubgroupResults)

        muscleGroupId = muscleGroupSubgroupResults.Items[0].muscle_group_id;
        console.log("Muscle Group ID for group ",es,": ",muscleGroupId)


    }    catch (error) {
        console.log("Error processing SubPlan and SubGroups: ",error)
    }

    try{
        muscleGroupSubgroupResults = await dynamodb.scan({TableName:"MuscleSubgroup",FilterExpression: "muscle_subplan_id = :mspid",
            ExpressionAttributeValues: {":mspid": splitId}}).promise()
        }
        catch (error) {
            console.log("Error fetching SubplanSubgroup:", error);
        }
    }


     }

    
    else{
    try{
        splitResults = await dynamodb.scan({TableName:"MuscleGroup",FilterExpression: "muscle_group_name = :mgn",
                    ExpressionAttributeValues: {":mgn": excSplit}}).promise()

        console.log("splitResults for split in Muscle group: ",splitResults)

        splitId = splitResults.Items[0].muscle_subplan_id;
        console.log("Muscle SubPlan ID for split ",excSplit,": ",splitId)


    }    catch (error) {
        console.log("Error processing SubPlan and SubGroups: ",error)
    }
}
}

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Excercise Split fetched successfully',data:userPlanResults.Items }),
      };
}

module.exports = {
    handler: fetchExcerciseSplit
}