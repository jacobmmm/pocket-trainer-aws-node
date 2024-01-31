const AWS = require("aws-sdk");

const getPlans = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  //const { userid } = event.pathParameters;

  //console.log("Extracted id", userid);

  let plans;
  let results;
  const attributeName = "muscle_plan_name"


  try {
    results = await dynamodb.scan({TableName:"MuscleBuildPlansV2"}).promise()
    plans = results.Items

    console.log(results)

    
  } catch (error) {
    console.log(error);
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
  handler: getPlans,
};
