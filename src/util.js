exports.getUserId = (req) => {
    return req.apiGateway.event.requestContext.authorizer.claims.sub;
}