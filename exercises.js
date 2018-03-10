var data = require('data')

exports.handle = (event, response) => {
    switch(event.httpMethod) {
        case 'GET':
            response.statusCode = 200
            response.body = JSON.stringify(data.exercises)
            return response;
        case 'POST':
            response.statusCode = 201
            response.body = event.body
            return response;
        case 'PUT':
            var item = JSON.parse(event.body);
            var resp = Object.assign({}, item);
            resp.name = resp.name + '!'
            
            response.statusCode = 200
            response.body = JSON.stringify(resp)
            return response;
        case 'DELETE':
            response.statusCode = 204
            response.body = event.body
            response.headers.AssetID = path[2]
            return response;
        default:
            response.statusCode = 405 // method not available
            return response;
    }
}