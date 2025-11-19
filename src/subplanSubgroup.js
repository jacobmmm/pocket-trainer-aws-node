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

    const { muscle_plan_name, username, splitname } = JSON.parse(event.body);


}

module.exports = {
    handler: subplanSubgroup
}