const awsServerlessExpress = require('aws-serverless-express');  
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const express = require('express');  
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cors({ exposedHeaders: 'X-Total-Count' }));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

var database = require('./database')

const getKey = (req) => {
    return req.apiGateway.event.requestContext.authorizer.claims.sub;
}

const workoutSort = (predicate) => {
    return (a, b) => {
        a = a.endTime;
        b = b.endTime;
        
        if (predicate === 'asc') {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }
        else { 
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        }
    }
}

// status - /workouts?status=<undone|done>
// pagination - /workouts?limit=N&offset=M
// sort - /workouts?order=<ASC|DESC>
// filter by routine - /workouts?routineId=guid
app.get('/workouts', (req, res) => { 
    let key = getKey(req);
    let status = req.query && req.query.status ? req.query.status.toLowerCase() : undefined;
    let order = req.query && req.query.order ? req.query.order.toLowerCase() : undefined;
    let routineId = req.query && req.query.routineId ? req.query.routineId.toLowerCase() : undefined;
    let limit = req.query && req.query.limit ? req.query.limit : 30;
    let offset = req.query && req.query.offset ? req.query.offset : 0;

    database.get('workouts', key)
    .then((data) => {
        let workouts = data && data.Item && data.Item.workouts ? data.Item.workouts : [];

        if (status) {
            if (status === 'done') {
                workouts = workouts.filter(workout => workout.endTime !== undefined)
            } 
            else if (status === 'undone') {
                workouts = workouts.filter(workout => workout.endTime === undefined)
            }
            else {
                res.status(400);
                res.status('Invalid status predicate \'' + status + '\'; specify undone or done')
            }
        }
        
        if (routineId) {
            workouts = workouts.filter(w => w.routine.id === routineId);
        }

        res.header('X-Total-Count', workouts.length);

        if (order) {
            if (order === 'asc' || order === 'desc') {
                workouts = workouts.sort(workoutSort(order))
            }
            else {
                res.status(400);
                res.json('Invalid order predicate \'' + order + '\'; specify ASC or DESC')
            }
        }

        if (offset && limit) {
            workouts = workouts.slice(+offset, +offset + +limit);
        }

        res.status(200);
        res.json(workouts);
    })
    .catch((err) => {
        res.status(500);
        res.json(err);
    });
});

app.get('/workouts/:id', (req,res) => {
    let key = getKey(req);
    let id = req.params.id;

    database.get('workouts', key)
    .then(data => {
        let workouts = data && data.Item && data.Item.workouts ? data.Item.workouts : [];
        let workout = workouts.find(workout => workout.id === id);

        if (workout === undefined) {
            res.status(404);
            res.json();
        }
        else {
            res.status(200);
            res.json(workout);
        }
    })
    .catch(err => {
        res.status(500);
        res.json(err);
    })
})

app.post('/workouts', (req, res) => {
    // todo: validate input
    // todo: coalesce startTime with current time if undefined
    // todo: ensure endTime undefined
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