//const { auth } = require('./auth')

const fetchUserId = async (event,dynamodb,userEmail) => {

    // const decodUser = await auth(event);
    // console.log("returned user ",decodUser)
    // const username = decodUser.userName;
    // console.log("Extracted Username: ",username);
    let results;
  
  
    try{
      results = await dynamodb.scan({TableName:"UserDetails"}).promise()
      users = results.Items
      console.log(users)
      }catch (error) {
          console.log(error)
      }
  
      const userDetails = users.find(ud => ud.email === userEmail);
  
      console.log(userDetails)
  
      let userId;
  
      if (userDetails) {
      userId = userDetails.userid;
      //console.log('User ID for ',decodUser  ,':', userId);
      return userId;
      } else {
      //console.log('User not found.');
      return undefined;
      }


}

exports.fetchUserId = fetchUserId;