const dbConfig = {
    connectionLimit : 10,
    host : process.env.DB_HOST_NAME,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port: 3306
}

module.exports = dbConfig;