const AWS = require('aws-sdk');

const subMuscleMuscleGroup = async (event) => {
  // Initialize DynamoDB client
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 3
      }
  );

  //var dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

console.log("EVent:", event)


const attributeName = 'muscle_group_name'
const { muscle } = event.pathParameters;
console.log(muscle)

let results;
let muscleGroups;
let muscleSubGroups;

  
try{
    results = await dynamodb.scan({TableName:"MuscleGroup"}).promise()
    muscleGroups = results.Items
    console.log(muscleGroups)
}catch (error) {
    console.log(error)
}

const muscleDetails = muscleGroups.find(group => group.muscle_group_name === muscle);
let muscleId;

if (muscleDetails) {
  muscleId = muscleDetails.muscle_group_id;
  console.log('Muscle ID for ',muscle,':', muscleId);
} else {
  console.log('Muscle Group not found.');
}

//LOCATING SUBMUSCLES BASED ON MUSCLE_ID

try{
    results = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
    muscleSubGroups = results.Items
    console.log("SubMuscle Objects: ",muscleSubGroups)
}catch (error) {
    console.log(error)
}


const matchingSubgroups = muscleSubGroups.filter(subgroup => subgroup.muscle_group_id === muscleId);

// Extract muscle_subgroup_name values from the filtered array
const muscleSubgroupNames = matchingSubgroups.map(subgroup => subgroup.muscle_subgroup_name);

console.log('Muscle Subgroup Names for Muscle Group ID:', muscleId, muscleSubgroupNames);

if (muscleSubgroupNames) {
    return{
        statusCode: 200,
        body: JSON.stringify({SubMuscles: muscleSubgroupNames}),
      };
  } else {
    console.log('Muscle Group not found.');
  }

}

module.exports = {
    handler: subMuscleMuscleGroup
  }
  