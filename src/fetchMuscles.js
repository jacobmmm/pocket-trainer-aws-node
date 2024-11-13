
const AWS = require("aws-sdk")
const getMuscles = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const attributeName  = 'muscle_group_name'

  let muscles;
  let results;
  try{
        results = await dynamodb.scan({TableName:"MuscleGroup"}).promise()
        muscles = results.Items
    }catch (error) {
        console.log(error)
    }

    console.log("Muscle Object: ",muscles)
  
    const muscleNames = results.Items.map(item => item[attributeName]);
    console.log(muscleNames)

  const outputs = {muscles:muscleNames}



  return {
    statusCode: 200,
    body: JSON.stringify(outputs),
  };
};

module.exports = {
  handler: getMuscles
}
