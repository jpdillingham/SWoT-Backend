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
var database = require('database')

const getKey = (req) => {
    return req.apiGateway.event.requestContext.authorizer.claims.sub;
}

app.get('/routines', (req, res) => { 
    let key = getKey(req);

    database.getRoutines(key)
    .then((data) => {
        res.status(200);
        res.json(data.Item.routines);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
});

app.post('/routines', (req, res) => {
    // todo: validate input
    let key = getKey(req);
    let routine = req.body;

    database.getRoutines(key)
    .then((data) => {
        let routines = data.Item.routines;
        routines.push(routine);
        
        database.setRoutines(key, routines).then((data) => {
            res.status(201);
            res.json(routine);
        });
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.put('/routines/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;
    let routine = req.body;

    database.getRoutines(key)
    .then((data) => {
        let routines = data.Item.routines;
        let foundRoutine = routines.find(routine => routine.id === id);

        let index = routines.indexOf(foundRoutine);

        routines[index] = routine;
        
        database.setRoutines(key, routines).then((data) => {
            res.status(200);
            res.json(routine);
            req.header('AssetID','tesasers');
        });
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.delete('/routines/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;

    database.getRoutines(key)
    .then((data) => {
        let routines = data.Item.routines;
        let routine = routines.find(routine => routine.id === id);
        routines = routines.filter(routine => routine.id !== id);
        
        database.setRoutines(key, routines).then((data) => {
            res.status(204);
            res.json(routine);
            req.header('AssetID','tesasers');
        });
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.get('/exercises', (req, res) => {
    let key = getKey(req);

    database.getExercises(key)
    .then((data) => {
        res.status(200);
        res.json(data.Item.exercises);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.post('/exercises', (req, res) => {
    // todo: validate input
    let key = getKey(req);
    let exercise = req.body;

    database.getExercisess(key)
    .then((data) => {
        let routines = data.Item.exercises;
        routines.push(exercise);
        
        database.setExercises(key, exercise).then((data) => {
            res.status(201);
            res.json(exercise);
        });
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.put('/exercises/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;
    let exercise = req.body;

    database.getExercises(key)
    .then((data) => {
        let exercises = data.Item.exercises;
        let foundExercise = exercises.find(exercise => exercise.id === id);

        let index = exercises.indexOf(foundExercise);

        exercises[index] = exercise;
        
        database.setExercises(key, exercises).then((data) => {
            res.status(200);
            res.json(exercise);
            req.header('AssetID','tesasers');
        });
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.delete('/exercises/:id', (req, res) => {
    res.status(204);
    res.json(req.body);
    req.header('AssetID', req.params.id);
})

app.listen(3000, () => console.log('Listening on port 3000.')); // ignored by lambda

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);  