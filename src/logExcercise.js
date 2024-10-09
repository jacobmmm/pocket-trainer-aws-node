const AWS = require('aws-sdk');
//const { auth } = require('../utilFunctions/auth')
const { fetchTable } = require('../utilFunctions/getTable')
const { fetchUserId } = require('../utilFunctions/getUserId')


const logExcUser = async (event) => {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        httpOptions: {
          timeout: 5000
        }},
        {
            maxRetries: 3
          }
      );

      let tables;

      const userId = await fetchUserId(event,dynamodb);
      console.log("UserId returned value: ",userId)
  
      const { excercise, weight, reps } = JSON.parse(event.body);

      
      /*tables = await fetchTable(event,dynamodb,"Excercises");

      const excDetails = tables.filter(exc => exc.excercise_name === excercise);
    
      console.log("Excercise Details: ",excDetails);

      const excId = excDetails.excercise_id;

      console.log("exc ID: ",excId);*/

      const userExcercise = {excerciseName:excercise, weight:weight, reps:reps};

      tables = await fetchTable(event,dynamodb,"UserDetails");

      const userDetails = tables.find(user => user.userid === userId);
    
      console.log("User Details: ",userDetails);

      if(userDetails){

      }

      else{
        console.log('User not found');
      }


}

module.exports = {
    handler: logExcUser
}