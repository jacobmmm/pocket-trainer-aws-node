const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addExcercises = async (event) => {

  try{

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const tableName = 'Excercises'
  // const { muscle_subgroup_id, muscle_subplan_id, excercise_name } = JSON.parse(event.body)
  // const excercise_id = v4();
  
  // console.log("Muscle SubGroup ID: ",excercise_id)

  // const excercise = {excercise_id, muscle_subgroup_id, muscle_subplan_id, excercise_name}  

  /*const validationErrors = validateInput(user);

  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: validationErrors }),
      
    };
  }*/

    const excercises = [
  {"Muscle":"Legs","Subgroup":"Quads","SubPlan":"Push","Excercise":"Barbell Squats"},
  {"Muscle":"Legs","Subgroup":"Quads","SubPlan":"Push","Excercise":"Leg Press"},
  {"Muscle":"Legs","Subgroup":"Hamstrings","SubPlan":"Pull","Excercise":"Dumbbell Romanian Deadlift"},
  {"Muscle":"Legs","Subgroup":"Hamstrings","SubPlan":"Pull","Excercise":"Hamstring Curls"},
  {"Muscle":"Legs","Subgroup":"Calves","SubPlan":"Push","Excercise":"Machine Calf Raises"},
  {"Muscle":"Legs","Subgroup":"Calves","SubPlan":"Push","Excercise":"Seated Calve Raises"},
  {"Muscle":"Legs","Subgroup":"Calves","SubPlan":"Push","Excercise":"Seated Calf Raises"},
  {"Muscle":"Chest","Subgroup":"Middle","SubPlan":"Push","Excercise":"Chest Press"},
  {"Muscle":"Chest","Subgroup":"Middle","SubPlan":"Push","Excercise":"Dumbbell Chest Press"},
  {"Muscle":"Chest","Subgroup":"Upper","SubPlan":"Push","Excercise":"Incline Chest Press"},
  {"Muscle":"Chest","Subgroup":"Upper","SubPlan":"Push","Excercise":"Incline Dumbbell Chest Press"},
  {"Muscle":"Chest","Subgroup":"Lower","SubPlan":"Push","Excercise":"Decline Press"},
  {"Muscle":"Shoulders","Subgroup":"Anterior","SubPlan":"Push","Excercise":"Military Press"},
  {"Muscle":"Shoulders","Subgroup":"Anterior","SubPlan":"Push","Excercise":"Dumbbell Military Press"},
  {"Muscle":"Shoulders","Subgroup":"Middle","SubPlan":"Push","Excercise":"Lateral Raise"},
  {"Muscle":"Shoulders","Subgroup":"Middle","SubPlan":"Push","Excercise":"Cable Lateral Raise"},
  {"Muscle":"Shoulders","Subgroup":"Rear","SubPlan":"Push","Excercise":"Seated Rear Delt Fly"},
  {"Muscle":"Shoulders","Subgroup":"Rear","SubPlan":"Push","Excercise":"Face Pulls"},
  {"Muscle":"Triceps","Subgroup":"Lateral Head","SubPlan":"Push","Excercise":"Cable Push Downs"},
  {"Muscle":"Triceps","Subgroup":"Lateral Head","SubPlan":"Push","Excercise":"Tricep Dips"},
  {"Muscle":"Triceps","Subgroup":"Medial Head","SubPlan":"Push","Excercise":"Cable Overhead Tricep Extension"},
  {"Muscle":"Triceps","Subgroup":"Long Head","SubPlan":"Push","Excercise":"Rope Tricep Extension"},
  {"Muscle":"Back","Subgroup":"Latismus Dorsi","SubPlan":"Pull","Excercise":"Cable Rows"},
  {"Muscle":"Back","Subgroup":"Latismus Dorsi","SubPlan":"Pull","Excercise":"Dumbbell Rows"},
  {"Muscle":"Back","Subgroup":"Trapezius","SubPlan":"Pull","Excercise":"Lateral Pulldowns"},
  {"Muscle":"Back","Subgroup":"Latismus Dorsi","SubPlan":"Pull","Excercise":"Cable Pull Downs"},
  {"Muscle":"Biceps","Subgroup":"Inner","SubPlan":"Pull","Excercise":"Bicep Curl"},
  {"Muscle":"Biceps","Subgroup":"Inner","SubPlan":"Pull","Excercise":"Machine Preacher Curl"},
  {"Muscle":"Biceps","Subgroup":"Outer","SubPlan":"Pull","Excercise":"Incline Bicep Curl"},
  {"Muscle":"Biceps","Subgroup":"Brachialis","SubPlan":"Pull","Excercise":"Hammer Curls"}
]



    const insertItem = async (msm) => {

      const muscle_name = msm['Muscle']
      console.log("Extracted Muscle: ",muscle_name)

      const sub_muscle = msm['Subgroup']
      console.log("Extracted subMuscle: ",sub_muscle)

      const push_pull = msm['Push/Pull']
      console.log("Extracted pushPull: ",push_pull)

      const excercise_name = msm['Excercise']
      console.log("Extracted excercise: ",excercise_name)

      let muscles = []
      let subMuscles = []
      let pushPull = []

      try{
        results = await dynamodb.scan({TableName:"MuscleGroup"}).promise()
        muscles = results.Items
      }catch (error) {
        console.log(error)
      }
  
      const muscleDetails = muscles.find(group => group.muscle_group_name.toLowerCase() === muscle_name.toLowerCase());
  
      let muscleId;
    
    if (muscleDetails) {
      muscleId = muscleDetails.muscle_group_id;
      console.log('muscle Group ID for',muscle_name  ,':', muscleId);
    } else {
      console.log('muscle not found.');
    }

    try{
      results = await dynamodb.scan({TableName:"MuscleSubGroup"}).promise()
      subMuscles = results.Items
    }catch (error) {
      console.log(error)
    }

    const subMuscleDetails = subMuscles.find(group => group.muscle_subgroup_name.toLowerCase() === sub_muscle.toLowerCase());

    let subMuscleId;
  
  if (subMuscleDetails) {
    subMuscleId = subMuscleDetails.muscle_subgroup_id;
    console.log('submuscle Group ID for',sub_muscle  ,':', subMuscleId);
  } else {
    console.log('submuscle not found.');
  }

  try{
    results = await dynamodb.scan({TableName:"MuscleSubPlan"}).promise()
    pushPull = results.Items
  }catch (error) {
    console.log(error)
  }

  const pushPullDetails = pushPull.find(group => group.muscle_subplan_name.toLowerCase() === push_pull.toLowerCase());

  let subPlanId;

if (pushPullDetails) {
  subPlanId = pushPullDetails.muscle_subplan_id;
  console.log('subplan ID for ',push_pull  ,':', subPlanId);
} else {
  console.log('submuscle not found.');
}

const excercise_id = v4();

const excerciseObj = {excercise_id:excercise_id, muscle_group_id:muscleId,muscle_subgroup_id:subMuscleId,muscle_subplan_id:subPlanId,excercise_name:excercise_name}

const params = {
  TableName: tableName,
  Item: excerciseObj,
};

try {
  await dynamodb.put(params).promise();
  console.log(`Successfully inserted excercise:`, excerciseObj);
} catch (error) {
  console.error(`Error inserting excercise:`, excerciseObj, error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: error }),

}
}


}

for (const exc of excercises) {
  await insertItem(exc);
}

// 1)Excercise_id  HASH
// 2)muscle_group_id
// 2)muscle_subgroup_id   
// 3)muscle_subplan_id
// 4)Exercise_name


  // if (!event.body) {
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ error: "Request body is missing." }),
  //   };
  // }

  // /*const hashedPassword = await hashPassword(password);
  // user.password = hashedPassword;*/


  // await dynamodb.put({
  //   TableName: "Excercises",
  //   Item: excercise
  // }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({message:"Added Excercises"}),
    
  };
}catch(error){

  console.error("Error in Lambda function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),

}
};
}

module.exports = {
  handler: addExcercises
}
