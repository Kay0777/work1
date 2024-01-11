// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Create application instances
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    const { Sequelize, DataTypes } = require('sequelize');
    const cron = require('node-cron');
    const { Worker } = require('worker_threads');

    // Database connection
    const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
        host: 'localhost',
        dialect: 'postgres',
    });

    // Task model definition
    const Task = sequelize.define('Task', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending',
        },
        executionTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        serverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    // Migrations
    const umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize: sequelize,
        },
        migrations: {
            params: [
                sequelize.getQueryInterface(),
                Sequelize,
            ],
            path: './migrations',
            pattern: /\.js$/,
        },
    });

    // Create "tasks" table and run migration
    umzug.up().then(() => {
        Task.sync().then(() => {
            console.log(`Database initialized on server ${cluster.worker.id}`);
        });
    });

    // Register tasks in the cron service
    const tasks = [
        { name: 'Task1', interval: '*/5 * * * * *' },
        { name: 'Task2', interval: '*/10 * * * * *' },
        // Add more tasks as needed
    ];

    tasks.forEach((task, index) => {
        cron.schedule(task.interval, () => {
            // Create a background task
            const newTask = {
                name: task.name,
                status: 'pending',
                executionTime: new Date(),
                serverId: cluster.worker.id,
            };

            // Write the task to the database
            Task.create(newTask).then(() => {
                // Start a worker thread to execute the task
                const worker = new Worker('./worker.js', {
                    workerData: { taskId: newTask.id },
                });

                worker.on('message', (message) => {
                    // Update the task status in the database
                    Task.update({ status: message.status }, { where: { id: newTask.id } });
                });
            });
        });
    });

    // Route to get the list of tasks
    app.get('/tasks', async (req, res) => {
        try {
            const taskList = await Task.findAll();
            return res.status(200).json(taskList);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Define the port for each instance
    const PORT = process.env.PORT || (3000 + cluster.worker.id);
    app.listen(PORT, () => {
        console.log(`Server ${cluster.worker.id} is running on port ${PORT}`);
    });
}
