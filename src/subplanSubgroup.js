const AWS = require('aws-sdk');

const { v4 } = require("uuid")


const subplanSubgroup = async  (event) => { 

    const dynamodb = new AWS.DynamoDB.DocumentClient({
          httpOptions: {
            timeout: 5000
          }},
          {
              maxRetries: 3
            }
        );

    const subplanSubgroups = {Push: ["Medial Head", "Lower Chest", "Upper Chest","Middle Chest", "Middle Delts", "Traps","Quads","Pects","Lateral Head","Long Head","Calves", "Anterior Delts","Rear Delts"], Pull: ["Glutes", "Trapezius", "Hamstrings", "Rhomboids", "Latismus Dorsi", "Outer Biceps", "Inner Biceps", "Brachialis"]}

    const subplans = Object.keys(subplanSubgroups);

    let subPlanId;

    for(let sp of subplans){
        try{
            let results = await dynamodb.scan({TableName:"MuscleSubPlan",
                FilterExpression: "muscle_subplan_name = :sp",
                ExpressionAttributeValues: {":sp": sp}
            }).promise()
            let subPlans = results.Items
            subPlanId = subPlans[0].muscle_subplan_id;
            
            console.log("SubPlans: ",subPlans)
            console.log("SubPlan ID for ",sp,": ",subPlanId)
            

        }
        catch (error) {
            console.log("Error fetching SubPlan: ",error)
        }
        const subgroups = subplanSubgroups[sp];

        for (let sg of subgroups){
            try{
                let results = await dynamodb.scan({TableName:"MuscleSubGroup",
                    FilterExpression: "muscle_subgroup_name = :sg",
                    ExpressionAttributeValues: {":sg": sg}
                }).promise()
                let subGroups = results.Items
                let subGroupId = subGroups[0].muscle_subgroup_id;
                console.log("SubGroups: ",subGroups)
                console.log("SubGroup ID for ",sg,": ",subGroupId)

                const records = {
                    subplan_subgroup_id: v4(),
                    muscle_subplan_id: subPlanId,
                    muscle_subgroup_id: subGroupId
                }

                const params = {
                TableName: tableName,
                Item: itemToInsert
                };

                try {
            await dynamodb.put(params).promise();
            console.log('record inserted successfully:', records);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Item inserted successfully' }),
            };
        } catch (error) {
            console.error('Error inserting item:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error inserting item', error: error.message }),
            };
        }
        

    


}catch (error) {
    console.log("Error fetching SubGroup: ",error)

}
        }
    }
}
    

module.exports = {
    handler: subplanSubgroup
}