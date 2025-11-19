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

    const subplanSubgroups = {push: ["Chest", "Shoulders", "Triceps"], pull: ["Back", "Biceps", "Rear Delts"]}


}

module.exports = {
    handler: subplanSubgroup
}