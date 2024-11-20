
const AWS = require("aws-sdk")
const getMuscles = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const attributeName  = 'muscle_group_name'

  let muscles;
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



  return {
    statusCode: 200,
    body: JSON.stringify(outputs),
  };
};

module.exports = {
  handler: getMuscles
}
