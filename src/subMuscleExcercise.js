const AWS = require('aws-sdk');

const subMuscleExcercise = async (event) => {
  // Initialize DynamoDB client
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 3
      }
  );

  const attributeName = 'muscle_subgroup_name'
  const { submuscle } = event.pathParameters;
  console.log(submuscle)
  
  let results;
  let muscleSubGroups;
  let subMuscleId;
  let excercises;
  
    
  try{
      results = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
      muscleSubGroups = results.Items
      console.log(muscleSubGroups)
  }catch (error) {
      console.log(error)
  }

  try{
    results = await dynamodb.scan({TableName:"Excercises"}).promise()
    excercises = results.Items
    console.log("excercise Objects: ",excercises)
    }catch (error) {
       console.log(error)
   }
  
  const subMuscleDetails = muscleSubGroups.find(group => group.muscle_subgroup_name === submuscle);
  let muscleId;
  
  if (subMuscleDetails) {
    subMuscleId = subMuscleDetails.muscle_subgroup_id;
    console.log('Submuscle Group ID for',submuscle  ,':', subMuscleId);
  } else {
    console.log('Submuscle not found.');
  }


  const matchingExcercises = excercises.filter(exc => exc.muscle_subgroup_id === subMuscleId);

// Extract muscle_subgroup_name values from the filtered array
  const muscleSubgroupNames = matchingExcercises.map(exc => exc.excercise_name);

  console.log('Muscle Subgroup Names for Muscle Group ID:', muscleId, muscleSubgroupNames);

  if (muscleSubgroupNames) {
        return{
            statusCode: 200,
            body: JSON.stringify({Excercises: muscleSubgroupNames}),
        };
    } else {
        console.log('Muscle Group not found.');
    }

    }




  module.exports = {
    handler: subMuscleExcercise
  }





