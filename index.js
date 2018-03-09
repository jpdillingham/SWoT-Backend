var data = require('data')

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
            switch(event.httpMethod) {
                case 'GET':
                    response.statusCode = 200
                    response.body = JSON.stringify(data.exercises)
                    callback(null, response);
                case 'POST':
                    response.statusCode = 201
                    response.body = event.body
                    callback(null, response);
                case 'PUT':
                    var item = JSON.parse(event.body);
                    var resp = Object.assign({}, item);
                    resp.name = resp.name + '!'
                    
                    response.statusCode = 200
                    response.body = JSON.stringify(resp)
                    callback(null, response);
                case 'DELETE':
                    response.statusCode = 204
                    response.body = event.body
                    response.headers.AssetID = path[2]
                    callback(null, response);
                default:
                    response.statusCode = 405 // method not available
                    callback(null, response)
            }
        case 'ROUTINES':
            switch(event.httpMethod) {
                case 'GET':
                    response.statusCode = 200
                    response.body = JSON.stringify(data.routines)
                    callback(null, response)
                case 'POST':
                    response.statusCode = 201
                    response.body = event.body
                    callback(null, response);
                case 'PUT':
                    var item = JSON.parse(event.body);
                    var resp = Object.assign({}, item);
                    resp.name = resp.name + '!'
                    
                    response.statusCode = 200
                    response.body = JSON.stringify(resp)
                    callback(null, response);
                case 'DELETE':
                    response.statusCode = 204
                    response.body = event.body
                    response.headers.AssetID = path[2]
                    callback(null, response);
                default:
                    response.statusCode = 405
                    callback(null, response)
            }
        default:
            response.statusCode = 404
            callback(null, response)
    }
};