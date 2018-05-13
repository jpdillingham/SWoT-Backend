const AWS = require('aws-sdk');
const constants = require('./constants');

AWS.config.update({ region: constants.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', convertEmptyValues: true });

exports.get = (property, key) => {
    let params = {
        TableName: constants.PRIMARY_TABLE,
        Key: {
            user: key,
        },
        ProjectionExpression: property,
    };
    
    return dynamoDB.get(params).promise();
}

exports.set = (property, key, value) => {
    let params = {
        TableName: constants.PRIMARY_TABLE,
        Key: { 
            user: key
        },
        UpdateExpression: 'SET #property = :value',
        ExpressionAttributeNames: { '#property' : property },
        ExpressionAttributeValues: { ':value': value }        
    } 
    
    return dynamoDB.update(params).promise();  
}

exports.scan = (key) => {
    let params = {
        TableName: constants.HISTORY_TABLE,
        Limit: 50,
    }

    return dynamoDB.scan(params).promise();
}