const express = require('express');
const cluster = require('cluster');
const cors = require('cors');

const { APP, DB } = require('./config');
const { userRoute } = require('./users');
const User = require('./users/model')
const Task = require('./tasks/model')
const { sequelize, db } = require('./db');

console.log('Fock yooouuu bitch....');

if (cluster.isMaster) {
    db.up().then(() => {
        User.sync().then(() => {
            console.log('User db initialized!');
            User.create().then(() => {
                console.log('User created!');
            })
        });
        Task.sync().then(() => {
            console.log('Task db initialized!');
        });
    })

    for (let i = 0; i < 5; i++) {
        cluster.fork();
    }
} else {
    const app = express()
    app.use(cors({
        origin: "*",
        methods: [
            'PATCH',
        ],
        preflightContinue: false,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/users', userRoute)

    const appPort = Number.parseInt(APP.port) + cluster.worker.id
    app.listen(appPort, APP.host, () => {
        console.log('Server:', `http://${APP.host}:${appPort}`);
    })
}

