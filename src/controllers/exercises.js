const database = require('../database')
const express = require('express');
const util = require('../util')

const router = express.Router();

router.get('/', (req, res) => {
    let userId = util.getUserId(req);

    database.get(userId, 'exercises')
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

router.post('/', (req, res) => {
    // todo: validate input
    let userId = util.getUserId(req);
    let exercise = req.body;

    database.get(userId, 'exercises')
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        exercises.push(exercise);
        
        return exercises;
    })
    .then((exercises) => {
        return database.set(userId, 'exercises', exercises);
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

router.put('/:id', (req, res) => {
    let userId = util.getUserId(req);
    let id = req.params.id;
    let exercise = req.body;

    database.get(userId, 'routines')
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];

        routines.map((routine) => {
            routine.exercises.map((e) => e.id === id && Object.assign(e, exercise))
        })

        return routines;
    })
    .then((routines) => {
        return database.set(userId, 'routines', routines);
    })
    .then(() => {
        return database.get(userId, 'exercises');
    })
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        let foundExercise = exercises.find(exercise => exercise.id === id);

        let index = exercises.indexOf(foundExercise);

        exercises[index] = exercise;
        
        return exercises;
    })
    .then((exercises) => {
        return database.set(userId, 'exercises', exercises);
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

router.delete('/:id', (req, res) => {
    let userId = util.getUserId(req);
    let id = req.params.id;

    database.get(userId, 'routines')
    .then((data) => {
        let routines = data && data.Item && data.Item.routines ? data.Item.routines : [];
        
        routines.map((routine) => {
            routine.exercises = routine.exercises.filter(exercise => exercise.id !== id);
        });

        return routines;
    })
    .then((routines) => {
        return database.set(userId, 'routines', routines);
    })
    .then(() => {
        return database.get(userId, 'exercises');
    })
    .then((data) => {
        let exercises = data && data.Item && data.Item.exercises ? data.Item.exercises : [];
        exercises = exercises.filter(exercise => exercise.id !== id);
        
        return exercises;
    })
    .then((exercises) => {
        return database.set(userId, 'exercises', exercises);
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

module.exports = router;