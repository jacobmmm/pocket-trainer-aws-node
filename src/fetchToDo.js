
const AWS = require("aws-sdk")
const fetchTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const { userid } = event.pathParameters

  console.log("Extracted id",userid)

  let user;
  
  try{
        const result = await dynamodb.get({TableName:"UserDetails", Key:{ userid }}).promise()
        user = result.Item
    }catch (error) {
        console.log(error)
    }
  




  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

module.exports = {
  handler: fetchTodo
}
