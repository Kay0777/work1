const { Sequelize, DataTypes } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');

const { DB } = require('./config')

const sequelize = new Sequelize(DB.name, DB.username, DB.password, {
    host: DB.host,
    dialect: DB.type
});

const db = new Umzug({
    migrations: {
        glob: path.join(__dirname, 'migrations'),
        params: [
            sequelize.getQueryInterface(),
            DataTypes
        ]
    },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

module.exports = {
    sequelize,
    db,
}