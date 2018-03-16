const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const removeEmptyStringElements = (obj) => {
  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {// dive deeper in
      removeEmptyStringElements(obj[prop]);
    } else if(obj[prop] === '') {// delete elements that are empty strings
      delete obj[prop];
    }
  }
  return obj;
}

exports.getRoutines = (key) => {
    let params = {
        TableName: 'SWoT',
        Key: {
            user: key,
        },
        ProjectionExpression: 'routines',
    };
    
    return dynamoDB.get(params).promise();
}

exports.setRoutines = (key, routines) => {
    let params = {
        TableName: 'SWoT',
        Key: { 
            user: key
        },
        UpdateExpression: 'SET #routines = :routines',
        ExpressionAttributeNames: { '#routines' : 'routines' },
        ExpressionAttributeValues: { ':routines': routines }        
    } 
    
    return dynamoDB.update(params).promise();
}

exports.getExercises = (key) => {
    let params = {
        TableName: 'SWoT',
        Key: {
            user: key,
        },
        ProjectionExpression: 'exercises',
    };
    
    return dynamoDB.get(params).promise();
}

exports.setExercises = (key, exercises) => {
    removeEmptyStringElements(exercises);
    
    let params = {
        TableName: 'SWoT',
        Key: { 
            user: key
        },
        UpdateExpression: 'SET #exercises = :exercises',
        ExpressionAttributeNames: { '#exercises' : 'exercises' },
        ExpressionAttributeValues: { ':exercises': exercises }        
    } 
    
    return dynamoDB.update(params).promise();
}