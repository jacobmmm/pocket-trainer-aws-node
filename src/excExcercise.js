const AWS = require('aws-sdk');

const excExcercise = async (event) => {
  // Initialize DynamoDB client
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
      timeout: 5000
    }},
    {
        maxRetries: 3
      }
  );

  const attributeName = 'muscle_subgroup_id'
  const { excercise } = event.pathParameters;
  console.log("path parameter: ",excercise)
  
  let results;
  let excercises;
  //let muscleSubGroups;
  let subMuscleId;
  
  
    
  try{
      results = await dynamodb.scan({TableName:"Excercises"}).promise()
      excercises = results.Items
      console.log(excercises)
  }catch (error) {
      console.log(error)
  }

  const excerciseDetails = excercises.find(exc => exc.excercise_name === excercise);
  let muscleId;
  
  if (excerciseDetails) {
    subMuscleId = excerciseDetails.muscle_subgroup_id;
    console.log('Submuscle for ',excercise  ,':', subMuscleId);
  } else {
    console.log('Submuscle not found.');
  }

  const matchingExcercises = excercises.filter(exc => (exc.muscle_subgroup_id === subMuscleId && exc.excercise_name!=excercise));
  console.log(matchingExcercises)
// Extract muscle_subgroup_name values from the filtered array
  const excerciseNames = matchingExcercises.map(exc => exc.excercise_name);

  console.log('Excercises similar to: ', excercise,": ",excerciseNames);

  if (excerciseNames) {

    const excStatement = "Similar Excercises to "+excercise;
    return{
        statusCode: 200,
        body: JSON.stringify({excStatement : excerciseNames}),
    };
} else {
    console.log('Muscle Group not found.');
}


}

module.exports = {
    handler: excExcercise
  }