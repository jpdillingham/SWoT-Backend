var data = require('data')

exports.handle = (request, response) => {
    let path = request.path.toUpperCase().split('/');    

    switch(request.httpMethod) {
        case 'GET':
            return get(request, response);
        case 'POST':
            return post(request, response);
        case 'PUT':
            return put(request, response);
        case 'DELETE':
            return _delete(request, response);
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

const post = (request, response) => { 
    response.statusCode = 201
    response.body = request.body
    return response;
}

const put = (request, response) => {
    var item = JSON.parse(request.body);
    var resp = Object.assign({}, item);
    resp.name = resp.name + '!'
    
    response.statusCode = 200
    response.body = JSON.stringify(resp)
    return response;
}

const _delete = (request, response) => {
    response.statusCode = 204
    response.body = request.body
    response.headers.AssetID = path[2]
    return response;
}