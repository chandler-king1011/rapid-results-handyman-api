const express = require("express");
require('dotenv').config();
const mysql = require("mysql");

const dbConfig = require("./database/database");
const Message = require("./models/messages");
const messageData = new Message();
const Job = require("./models/jobs");
const jobData = new Job();

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
    messageData.getAllMessages(res);
})

app.get("/messages/:id", (req, res) => {
    messageData.getSingleMessage(req.params.id, res);
})

app.post("/messages", (req, res) => {
    messageData.postMessage(req.body, res);
})

app.delete("/messages/:id", (req, res) => {
    messageData.deleteMessage(req.params.id, res);
})


// Routes for jobs

app.get("/jobs", (req, res) => {
    jobData.getAllJobs(res);
})

app.get("/jobs/:id", (req, res) => {
    jobData.getSingleJob(req.params.id, res);
})

app.listen(port, () => console.log(`Server is running on port ${port}.`));
