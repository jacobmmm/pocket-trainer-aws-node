const { v4 } = require("uuid")
const AWS = require("aws-sdk")
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');

//const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;



const addSubMuscles = async (event) => {

  try{

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const tableName = 'MuscleSubGroup';

  const muscleSubMuscle = [{'Legs':['Quads','Hamstrings','Glutes','Calves']},{'Chest':['Upper','Middle','Lower','Pects']},
                          {'Shoulders':['Anterior','Traps','Middle','Rear']},{'Back':['Latismus Dorsi','Trapezius','Rhomboids']},{'Biceps':['Inner','Outer','Brachialis']},{'Triceps':['Lateral Head','Long Head','Medial Head']}]

  const insertItem = async (msm) => {
    
    const muscle_name = Object.keys(msm)[0]
    const sub_muscles = Object.values(msm)[0]
    let muscles = []
    console.log("Extracted Muscle Name: ", muscle_name)
    console.log("Extracted SubMuscles: ",sub_muscles)

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

    console.log("Extracting subMuscles of : ",muscle_name)
    for (const sm of sub_muscles){

      console.log("subMuscle: ",sm)
      const muscle_subgroup_id = v4();
      const subMuscleItem ={muscle_subgroup_id:muscle_subgroup_id,muscle_group_id:muscleId,muscle_subgroup_name:sm}
      const params = {
        TableName: tableName,
        Item: subMuscleItem,
      };

      try {
        await dynamodb.put(params).promise();
        console.log(`Successfully inserted plan:`, subMuscleItem);
      } catch (error) {
        console.error(`Error inserting plan:`, subMuscleItem, error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error }),
    
    }
      }

      

    }

    
  
    
  };

  for (const msm of muscleSubMuscle) {
    await insertItem(msm);
  }  
  // const { muscle_group_id, muscle_subgroup_name } = JSON.parse(event.body)
  // const muscle_subgroup_id = v4();
  
  // console.log("Muscle SubGroup ID: ",muscle_subgroup_id)

  // const muscleSubGroup = {muscle_subgroup_id,muscle_group_id, muscle_subgroup_name}  

  // /*const validationErrors = validateInput(user);

  // if (validationErrors.length > 0) {
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ errors: validationErrors }),
      
  //   };
  // }*/

  // if (!event.body) {
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ error: "Request body is missing." }),
  //   };
  // }

  // /*const hashedPassword = await hashPassword(password);
  // user.password = hashedPassword;*/


  // await dynamodb.put({
  //   TableName: "MuscleSubGroup",
  //   Item: muscleSubGroup
  // }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({message:'successfully inserted subMuscles'}),
    
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
  handler: addSubMuscles
}
