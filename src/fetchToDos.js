
const AWS = require("aws-sdk")
const fetchTodos = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const attributeName  = 'muscle_plan_name'

  let users;
  
  try{
        const results = await dynamodb.scan({TableName:"MuscleBuildPlansV2"}).promise()
        users = results.Items
    }catch (error) {
        console.log(error)
    }
  
  const planNames = results.Items.map(item => item[attributeName]);
  console.log(planNames)

  const outputs = {plans:planNames}



  return {
    statusCode: 200,
    body: JSON.stringify(outputs),
  };
};

module.exports = {
  handler: fetchTodos
}
