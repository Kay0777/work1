const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

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
});

module.exports = Task;