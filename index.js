var data = require('data')
var exercises = require('exercises')
var routines = require('routines')

exports.handler = (event, context, callback) => {
    var response = {
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true,
            "AssetID" : undefined,
        },
        "isBase64Encoded": false
    };

    let path = event.path.toUpperCase().split('/');    
    
    switch(path[1]) {
        case 'EXERCISES':
            callback(null, exercises.handle(event, response));
        case 'ROUTINES':
            callback(null, routines.handle(event, response));
        default:
            response.statusCode = 404
            callback(null, response)
    }
};