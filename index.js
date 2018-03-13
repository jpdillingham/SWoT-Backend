const awsServerlessExpress = require('aws-serverless-express');  
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const express = require('express');  
const cors = require('cors');
const bodyParser = require('body-parser'); 

AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cors());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

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

app.delete('/routines/:id', (req, res) => {
    res.status(204);
    res.json(req.body);
    req.header('AssetID', req.params.id);
})

app.get('/exercises', (req, res) => {
    let email = req.apiGateway.event.requestContext.authorizer.claims.email;
    let params = {
        TableName: 'SWoT-Exercises',
        Key: {
            'email': email,
        }
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            res.status(500);
            res.json(err);
        } 
        else {
            res.status(200);
            res.json(data.Item.data);
        }
    });
})

app.post('/exercises', (req, res) => {
    res.status(201);
    res.json(req.body);
})

app.put('/exercises', (req, res) => {
    var body = req.body;
    body.name = body.name + "!"

    res.status(200);
    res.json(body)
})

app.delete('/exercises/:id', (req, res) => {
    res.status(204);
    res.json(req.body);
    req.header('AssetID', req.params.id);
})

app.listen(3000, () => console.log('Listening on port 3000.')); // ignored by lambda

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);  