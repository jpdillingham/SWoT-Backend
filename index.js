const awsServerlessExpress = require('aws-serverless-express');   
const express = require('express');  

const app = express();

var data = require('data')

app.get('/routines', (req, res) => {  
    res.status(200);
    res.json(data.routines);
});

app.post('/routines', (req, res) => {
    res.status(201);
    res.json(req.body);
})

app.put('/routines', (req, res) => {
    var body = req.body;
    body.name = body.name + "!"

    res.status(200);
    res.json(body)
})

app.delete('/routines/:id', (req, rese) => {
    res.status(204);
    res.json(req.body);
    req.header('AssetID', req.params.id);
})

app.listen(3000, () => console.log('Listening on port 3000.')); // ignored by lambda

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);  