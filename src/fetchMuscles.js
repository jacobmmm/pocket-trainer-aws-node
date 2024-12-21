
const AWS = require("aws-sdk")
const getMuscles = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const attributeName  = 'muscle_group_name'
  const subMuscleAttr = 'muscle_subgroup_name'

  let muscles;
  let subMuscleItems;
  
  let sub_muscles;
  let results;
  try{
        results = await dynamodb.scan({TableName:"MuscleGroup"}).promise()
        results_subgroup = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
        muscles = results.Items
        sub_muscles = results_subgroup.Items
    }catch (error) {
        console.log(error)
    }

  console.log("All Muscles: ",muscles)
  
  //const muscleNames = results.Items.map(item => item[attributeName]);

  try{
    results = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
    subMuscleItems = results.Items
}catch (error) {
    console.log(error)
}

// const subMuscles = results.Items.map(item => item[subMuscleAttr]);
//   console.log(subMuscles)

  const muscleSubMuscle = []
  console.log("Looping through muscles and submuscles")
  for (const muscle of muscles) {

    console.log("muscle: ", muscle)
    const smList = []
    
    for(sm of subMuscleItems){
      console.log("subMuscle: ",sm)

      if(muscle.muscle_group_id === sm.muscle_group_id){

        smList.push(sm.muscle_subgroup_name)
      }

  }
    const muscleName = muscle.muscle_group_name
    let muscleObj = {[muscleName]:smList}

    console.log("Muscle Object for: ",muscleName)
    console.log(muscleObj)
    muscleSubMuscle.push(muscleObj)



  }

  const outputs = {muscleDet:muscleSubMuscle}



  return {
    statusCode: 200,
    body: JSON.stringify(outputs),
  };
};

module.exports = {
  handler: getMuscles
}
