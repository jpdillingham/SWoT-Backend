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

var data = require('./data')
var database = require('./database')

const getKey = (req) => {
    return req.apiGateway.event.requestContext.authorizer.claims.sub;
}

app.get('/workouts', (req, res) => { 
    let key = getKey(req);

    database.get('workouts', key)
    .then((data) => {
        let workouts = data && data.Item && data.Item.workouts ? data.Item.workouts : [];
        res.status(200);
        res.json(workouts);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
});

app.post('/workouts', (req, res) => {
    // todo: validate input
    let key = getKey(req);
    let workout = req.body;

    database.get('workouts', key)
    .then((data) => {
        let workouts = data && data.Item && data.Item.workouts ? data.Item.workouts : [];
        workouts.push(workout);
        
        return workouts;
    })
    .then((workouts) => {
        return database.set('workouts', key, workouts);
    })
    .then(() => {
        res.status(201);
        res.json(workout);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.put('/workouts/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;
    let workout = req.body;

    database.get('workouts', key)
    .then((data) => {
        let workouts = data && data.Item && data.Item.workouts ? data.Item.workouts : [];
        let foundworkout = workouts.find(workout => workout.id === id);

        let index = workouts.indexOf(foundworkout);

        workouts[index] = workout;
        
        return workouts;
    })
    .then((workouts) => {
        return database.set('workouts', key, workouts);
    })
    .then(() => {
        res.status(200);
        res.json(workout);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.delete('/workouts/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;

    database.get('workouts', key)
    .then((data) => {
        let workouts = data && data.Item && data.Item.workouts ? data.Item.workouts : [];
        workouts = workouts.filter(workout => workout.id !== id);
        
        console.log('updated', workouts);
        return workouts;
    })
    .then((workouts) => {
        return database.set('workouts', key, workouts);
    })
    .then(() => {
        res.status(204);
        res.json();
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.get('/routines', (req, res) => { 
    let key = getKey(req);

    database.get('routines', key)
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];
        res.status(200);
        res.json(routines);
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

    database.get('routines', key)
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];
        routines.push(routine);
        
        return routines;
    })
    .then((routines) => {
        return database.set('routines', key, routines);
    })
    .then(() => {
        res.status(201);
        res.json(routine);
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

    database.get('routines', key)
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];
        let foundRoutine = routines.find(routine => routine.id === id);

        let index = routines.indexOf(foundRoutine);

        routines[index] = routine;
        
        return routines;
    })
    .then((routines) => {
        return database.set('routines', key, routines);
    })
    .then(() => {
        res.status(200);
        res.json(routine);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.delete('/routines/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;

    database.get('routines', key)
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];
        routines = routines.filter(routine => routine.id !== id);
        
        console.log('updated', routines);
        return routines;
    })
    .then((routines) => {
        return database.set('routines', key, routines);
    })
    .then(() => {
        res.status(204);
        res.json();
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.get('/exercises', (req, res) => {
    let key = getKey(req);

    database.get('exercises', key)
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        res.status(200);
        res.json(exercises);
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

    database.get('exercises', key)
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        exercises.push(exercise);
        
        return exercises;
    })
    .then((exercises) => {
        return database.set('exercises', key, exercises);
    })
    .then(() => {
        res.status(201);
        res.json(exercise);
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

    database.get('routines', key)
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];

        routines.map((routine) => {
            routine.exercises.map((e) => e.id === id && Object.assign(e, exercise))
        })

        return routines;
    })
    .then((routines) => {
        return database.set('routines', key, routines);
    })
    .then(() => {
        return database.get('exercises', key);
    })
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        let foundExercise = exercises.find(exercise => exercise.id === id);

        let index = exercises.indexOf(foundExercise);

        exercises[index] = exercise;
        
        return exercises;
    })
    .then((exercises) => {
        return database.set('exercises', key, exercises);
    })
    .then(() => {
        res.status(200);
        res.json(exercise);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.delete('/exercises/:id', (req, res) => {
    let key = getKey(req);
    let id = req.params.id;

    database.get('routines', key)
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];
        
        routines.map((routine) => {
            routine.exercises = routine.exercises.filter(exercise => exercise.id !== id);
        });

        return routines;
    })
    .then((routines) => {
        return database.set('routines', key, routines);
    })
    .then(() => {
        return database.get('exercises', key);
    })
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        exercises = exercises.filter(exercise => exercise.id !== id);
        
        return exercises;
    })
    .then((exercises) => {
        return database.set('exercises', key, exercises);
    })
    .then((data) => {
        res.status(204);
        res.json();
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
})

app.listen(3000, () => console.log('Listening on port 3000.')); // ignored by lambda

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);