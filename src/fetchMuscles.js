
const AWS = require("aws-sdk")
const getMuscles = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const attributeName  = 'muscle_group_name'
  const subMuscleAttr = 'muscle_subgroup_name'

  let muscles;
<<<<<<< HEAD
  let subMuscleItems;
  
=======
  let sub_muscles;
>>>>>>> ccbbc388f2d2598691883c9385acd4938ad6253a
  let results;
  try{
        results = await dynamodb.scan({TableName:"MuscleGroup"}).promise()
        results_subgroup = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
        muscles = results.Items
        sub_muscles = results_subgroup.Items
    }catch (error) {
        console.log(error)
    }

<<<<<<< HEAD
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
=======
    console.log("Muscle Object: ",muscles)
    console.log("SubMuscle Object: ",sub_muscles)

    let i=0;
    let muscle_id=0x1A;
    let muscle_name=" ";
    let muscle_det=[]

    while(i < muscles.length){

      muscle_id=muscles[i].muscle_group_id;
      muscle_name=muscles[i].muscle_group_name;

      let j=0;
      let submuscles=[]

      while( j < sub_muscles.length ){
        if(muscle_id == sub_muscles[j].muscle_group_id){
          submuscles.push(sub_muscles[j].muscle_subgroup_name)
        }
        j=j+1
      }

      let muscleObject={[muscle_name]: submuscles}
      console.log("Muscle Object for ",muscle_name,": ",muscleObject)
      muscle_det.push(muscleObject)

      i=i+1;

      


    }

    console.log("Final Muscle Detail Object Array ",muscle_det)
  
    const muscleNames = results.Items.map(item => item[attributeName]);
    console.log(muscleNames)

  // const outputs = {muscles:muscleNames}

    const outputs = {muscles:muscle_det}
>>>>>>> ccbbc388f2d2598691883c9385acd4938ad6253a



  return {
    statusCode: 200,
    body: JSON.stringify(outputs),
  };
};

module.exports = {
  handler: getMuscles
}
