const express = require("express");
require('dotenv').config();
const mysql = require("mysql");

const dbConfig = require("./database/database");

const dbConn = mysql.createPool(dbConfig);
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Routes for messages

app.get("/messages", (req, res) => {
    dbConn.query("SELECT * FROM message",
    (err, results) => {
        if (err) {
            res.status(404).send("Cannot retrieve data. Please try again later.");
        } else {
            console.log(results);
            res.status(200).send(results);
        }
    })
})


app.listen(port, () => console.log(`Server is running on port ${port}.`));
