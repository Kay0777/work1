const dotenv = require('dotenv')

dotenv.config({
    path: '.env',
    allowEmptyValues: false
})

module.exports = {
    APP: {
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
    },
    DB: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_DATABASE_NAME,
        poolLimit: Number.parseInt(process.env.DB_POOL_LIMIT),
        appName: process.env.DB_APP_NAME,
        type: process.env.DB_TYPE,
    }
}