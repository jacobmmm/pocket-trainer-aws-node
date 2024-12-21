const fetchTable = async (event,dynamodb,tableName) => {

  
    try{
      results = await dynamodb.scan({TableName:tableName}).promise()
      tableRows = results.Items
      console.log(tableRows)
      return tableRows;
      }catch (error) {
          console.log(error)
          return undefined;
      }


}

exports.fetchTable = fetchTable;