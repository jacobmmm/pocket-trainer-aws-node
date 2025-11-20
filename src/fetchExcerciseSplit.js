

const fetchExcerciseSplit = async  (event) => { 

    const dynamodb = new AWS.DynamoDB.DocumentClient({
          httpOptions: {
            timeout: 5000
          }},
          {
              maxRetries: 3
            }
        );
    const { plan,split,username } = JSON.parse(event.body);

    let planResults;
    let musclePlanId;
    let userResults;
    let userId;
    let userPlanResults;
    

    try{
        planResults = await dynamodb.scan({TableName:"MuscleBuildPlansV2",FilterExpression: "muscle_plan_name = :mpn",
                    ExpressionAttributeValues: {":mpn": plan}}).promise()

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
        userPlanResults = await dynamodb.scan({TableName:"MusclePlanUserSubMuscle3",FilterExpression: "userId = :userId AND muscle_plan_id = :mpid",
                    ExpressionAttributeValues: {":userId": userId,":mpid":  musclePlanId}}).promise()

        console.log("UserPlanSubMuscDetails: ",userPlanResults.Items)

    }
    catch (error) {
        console.log("Error fetching UserPlanSubMuscDetails:", error);
    }
}