const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10000,
        validate: {
            min: 0,
        },
    },
}, { freezeTableName: true });

module.exports = User;