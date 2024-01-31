const AWS = require('aws-sdk');

const fetchUserPlan = async (event) => {
  // Initialize DynamoDB client
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 3
      }
  );

}