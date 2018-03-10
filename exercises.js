var data = require('data')

exports.handle = (request, response) => {
    switch(request.httpMethod) {
        case 'GET':
            return get(request, response);
        case 'POST':
            response.statusCode = 201
            response.body = request.body
            return response;
        case 'PUT':
            var item = JSON.parse(request.body);
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

const get = (request, response) => {
    response.statusCode = 200
    response.body = JSON.stringify(data.exercises)
    return response;
}