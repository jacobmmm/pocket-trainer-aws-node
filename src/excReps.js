const AWS = require('aws-sdk');
const { v4 } = require("uuid")
const TableName = 'UserDetails';

const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 6
      }
  );

const excReps = async (event) => {

    

      const { email, excercise_name, weight, rep } = JSON.parse(event.body)

      const user_params = {
        TableName:TableName,
        FilterExpression: "email=:email",
        ExpressionAttributeValues: {  ':email': email,
        },
      };

      const user = await dynamodb.scan(user_params).promise();
      
      console.log("Queried User: ",user)

      const user_excercise_id = v4();

      const userExcLogs = {user_excercise_id:user_excercise_id,userEmail:email,excerciseName:excercise_name, weight:weight, rep:rep};
      try{
      await dynamodb.put({
        TableName: "UserExcerciseLogsV2",
        Item: userExcLogs
      }).promise();
      
    //   console.log("Exc logs added: ",userExcLogs)

      return {
        statusCode: 200,
        body: JSON.stringify({"userExcLogs ":userExcLogs}),
        
      };

    }catch(error){

        console.error("Error in Lambda function:", error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
      
      }
      };


    //   const userExcReps = {}
//       let excRec = []
//       let weightRec = []
//       let repRec = []
      
//       let excKey = excercise_name

//       let excDet = {
//         "name":excKey,
//         "weight":weights,
//         "reps":reps
//       }

//      if(user.excLog){ 
//         excRec = user.excLog
//         excRec.push(excDet)
//         user.excLog = excRec

//      }
        
//         // if(user.excLog.some(exc => excKey in exc)){
//         //   weightRec = user.excLog[excKey][0]  
//         //   repRec = user.excLog[excKey][1]
//         //   weightRec.push(weights)
//         //   repRec.push(reps)
//         //   user.excLog[excKey] = [weightRec, repRec]
//         // } 

     

//      else{
//         excRec.push(excDet)
//         user.excLog = excRec

//     //     weightRec.push(weights)
//     //     repRec.push(reps)
//     //     user.excLog[excKey] = [weightRec, repRec]

//       }
//       try{
//       const updateParams = {
//         TableName: "UserDetails",
//         Key: {
//             "userid": user.userid
//         },
//         UpdateExpression: "set ExcLogs = :excLog",
//         ExpressionAttributeValues: {
//             ":excLog": excLog
//         },
//         ReturnValues: "UPDATED_NEW"
//     };

//     await dynamodb.update(updateParams).promise();

//    return { statusCode: 200, body: JSON.stringify('Inserted/Updated Excercise Logs') };
    
       
// }catch (error) {
//     console.error("Error updating items:", JSON.stringify(error, null, 2));
//     return { statusCode: 500, body: JSON.stringify('Failed to update items') };
// }




}

module.exports = {
    handler: excReps
  }