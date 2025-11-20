const AWS = require('aws-sdk');
const { auth } = require('../utilFunctions/auth')
const { fetchTable } = require('../utilFunctions/getTable')
const { fetchUserId } = require('../utilFunctions/getUserId')


const fetchWorkoutExcercises = async (event) => { 
    // Initialize DynamoDB client
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      httpOptions: {
        timeout: 5000
      }},
      {
          maxRetries: 3
        }
    );

    const subplans = ["PUSH", "PULL"]

    const { workout_split, workout_plan, email } = JSON.parse(event.body);

    try{
      results = await dynamodb.scan({TableName:"UserDetails"}).promise()
      users = results.Items
      console.log(users)
      }catch (error) {
          console.log(error)
      }
  
      const userDetails = users.find(ud => ud.email === email);
  
      console.log(userDetails)
  
      let userId;
  
      if (userDetails) {
      userId = userDetails.userid;
      console.log('User ID for email',email," : " ,userId);
      //console.log('User ID for ',decodUser  ,':', userId);
      } 
      else {
      console.log('User not found.');
      return {
          statusCode: 404,
          body: JSON.stringify({ error: 'User not found' })
      };
      }

    // Find muscle_plan_id from MuscleBuildPlansV2 table
    let musclePlanId = null;
    try {
        const musclePlanQuery = await dynamodb.scan({
            TableName: "MuscleBuildPlansV2"
        }).promise();

        if (musclePlanQuery.Items && musclePlanQuery.Items.length > 0) {
            for (const record of musclePlanQuery.Items) {
                if (record.muscle_plan_name === workout_plan.toUpperCase()) {
                    musclePlanId = record.muscle_plan_id;
                    console.log(`Found muscle_plan_id: ${musclePlanId} for workout_plan: ${workout_plan}`);
                    break;
                }
            }
        }

        if (!musclePlanId) {
            console.log(`No muscle plan found for: ${workout_plan}`);
            return {
                statusCode: 404,
                body: JSON.stringify({ error: `Muscle plan not found for: ${workout_plan}` })
            };
        }
    } catch (error) {
        console.log('Error fetching muscle plan:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch muscle plan' })
        };
    }


    let muscleSubgroupIds = [];
    if (musclePlanId !== null) {
        try {
            const subMuscleQuery = await dynamodb.scan({
                TableName: "MusclePlanUserSubMuscle3"
            }).promise();

            if (subMuscleQuery.Items && subMuscleQuery.Items.length > 0) {
                for (const record of subMuscleQuery.Items) {
                    if (record.userid === userId && record.muscle_plan_id === musclePlanId) {
                        muscleSubgroupIds.push(record.muscle_subgroup_id);
                    }
                }
            }

            console.log(`Found ${muscleSubgroupIds.length} muscle subgroup IDs:`, muscleSubgroupIds);
            
        } catch (error) {
            console.log('Error fetching muscle subgroups:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch muscle subgroups' })
            };
        }
    }



    // Check the two cases based on workout_split
    if (subplans.includes(workout_split.toUpperCase())) {
                // Case 1: workout_split equals any value in subplans array
        console.log(`Workout split ${workout_split} is a subplan`);
        
        try {
            // Query entire MuscleSubPlan table
            const subplanQuery = await dynamodb.scan({
                TableName: "MuscleSubPlan"
            }).promise();

            // Find matching subplan by comparing uppercase versions
            let subplanId = null;
            const workoutSplitUpper = workout_split.toUpperCase();
            
            if (subplanQuery.Items && subplanQuery.Items.length > 0) {
                for (const record of subplanQuery.Items) {
                    const subplanNameUpper = record.subplan_name.toUpperCase();
                    if (subplanNameUpper === workoutSplitUpper) {
                        subplanId = record.subplan_id;
                        console.log(`Found subplan ID: ${subplanId} for ${workout_split}`);
                        break;
                    }
                }
            }

            if (subplanId) {
                // Fetch exercises based on subplanId and muscleSubgroupIds
                let exercises = [];
                
                try {
                    // Check if muscle_group_ids are present (scan for muscle groups)
                    const muscleGroupQuery = await dynamodb.scan({
                        TableName: "MuscleGroups" // Assuming this table exists
                    }).promise();
                    
                    let muscle_group_ids = [];
                    if (muscleGroupQuery.Items && muscleGroupQuery.Items.length > 0) {
                        // Extract muscle group IDs that might be relevant
                        muscle_group_ids = muscleGroupQuery.Items.map(item => item.muscle_group_id);
                    }

                    if (muscle_group_ids.length > 0) {
                        // Case: muscle_group_ids are present - get exercises for each combination
                        console.log('Fetching exercises using muscle_group_ids and muscleSubgroupIds');
                        
                        for (const muscleGroupId of muscle_group_ids) {
                            for (const muscleSubgroupId of muscleSubgroupIds) {
                                const exerciseQuery = await dynamodb.scan({
                                    TableName: "Exercises" // Assuming this is the exercises table
                                }).promise();
                                
                                if (exerciseQuery.Items) {
                                    const matchingExercises = exerciseQuery.Items.filter(exercise => 
                                        exercise.muscle_group_id === muscleGroupId && 
                                        exercise.muscle_subgroup_id === muscleSubgroupId
                                    );
                                    exercises.push(...matchingExercises);
                                }
                            }
                        }
                    } else {
                        // Case: subplanId is present but no muscle_group_ids - use subplanId and muscleSubgroupIds
                        console.log('Fetching exercises using subplanId and muscleSubgroupIds');
                        
                        for (const muscleSubgroupId of muscleSubgroupIds) {
                            const exerciseQuery = await dynamodb.scan({
                                TableName: "Exercises" // Assuming this is the exercises table
                            }).promise();
                            
                            if (exerciseQuery.Items) {
                                const matchingExercises = exerciseQuery.Items.filter(exercise => 
                                    exercise.subplan_id === subplanId && 
                                    exercise.muscle_subgroup_id === muscleSubgroupId
                                );
                                exercises.push(...matchingExercises);
                            }
                        }
                    }

                    console.log(`Found ${exercises.length} exercises for subplan case`);
                    
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ 
                            message: `Processing subplan: ${workout_split}`,
                            userId: userId,
                            subplanId: subplanId,
                            muscleSubgroupIds: muscleSubgroupIds,
                            exercises: exercises,
                            type: 'subplan'
                        })
                    };
                    
                } catch (exerciseError) {
                    console.log('Error fetching exercises:', exerciseError);
                    return {
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Failed to fetch exercises' })
                    };
                }
            } else {
                console.log(`No subplan found for: ${workout_split}`);
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: `Subplan not found for: ${workout_split}` })
                };
            }
        } catch (error) {
            console.log('Error processing subplan:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to process subplan' })
            };
        }
    } else {
        // Case 2: workout_split is any other value
        console.log(`Workout split ${workout_split} is not a subplan`);
        
        try {
            // Case: neither subplanId is present - fetch all exercises corresponding to muscleSubgroupIds
            let exercises = [];
            
            console.log('Fetching exercises using only muscleSubgroupIds (no subplan)');
            
            for (const muscleSubgroupId of muscleSubgroupIds) {
                const exerciseQuery = await dynamodb.scan({
                    TableName: "Exercises" // Assuming this is the exercises table
                }).promise();
                
                if (exerciseQuery.Items) {
                    const matchingExercises = exerciseQuery.Items.filter(exercise => 
                        exercise.muscle_subgroup_id === muscleSubgroupId
                    );
                    exercises.push(...matchingExercises);
                }
            }

            console.log(`Found ${exercises.length} exercises for regular workout split case`);
            
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    message: `Processing regular workout split: ${workout_split}`,
                    userId: userId,
                    muscleSubgroupIds: muscleSubgroupIds,
                    exercises: exercises,
                    type: 'regular'
                })
            };
        } catch (error) {
            console.log('Error processing regular workout split:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to process workout split' })
            };
        }
    }
}

module.exports = { handler: fetchWorkoutExcercises };
