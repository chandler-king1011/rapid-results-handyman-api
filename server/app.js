const express = require("express");
require('dotenv').config();
const mysql = require("mysql");
const fileUpload = require("express-fileupload");

const dbConfig = require("./database/database");
const Message = require("./models/messages");
const messageData = new Message();
const Job = require("./models/jobs");
const jobData = new Job();
const Image = require("./models/images");
const imageData = new Image();
const Admin = require("./models/admins");
const adminData = new Admin();

const verify = require("./auth/verifyToken");
const dbConn = mysql.createPool(dbConfig);
const app = express();
const port = process.env.PORT || 5000;

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Routes for messages

app.get("/messages", verify, (req, res) => {
    messageData.getAllMessages(res);
});

app.get("/messages/:id", verify, (req, res) => {
    messageData.getSingleMessage(req.params.id, res);
});

app.post("/messages", (req, res) => {
    messageData.postMessage(req.body, res);
});

app.delete("/messages/:id", verify, (req, res) => {
    messageData.deleteMessage(req.params.id, res);
});


// Routes for jobs

app.get("/jobs", (req, res) => {
    jobData.getAllJobs(res);
});

app.get("/jobs/:id", (req, res) => {
    jobData.getSingleJob(req.params.id, res);
});

app.post("/jobs", verify, (req, res) => {
    jobData.postJob(req.body, req.files, res);
});

app.put("/jobs/:id", verify, (req, res) => {
    jobData.updateJob(req.params.id, req.body, res);
});

app.delete("/jobs/:id", verify, (req, res) => {
    jobData.deleteJobImage(req.params.id, req.body.publicId, res);
});

// routes for images

app.get("/images", (req, res) => {
    imageData.getAllImages(res);
});

app.get("/images/job/:id", (req, res) => {
    imageData.getJobImages(req.params.id, res);
});

app.get("/images/:id", (req, res) => {
    imageData.getSingleImage(req.params.id, res);
});

app.post("/images", verify, (req, res) => {
    imageData.uploadImage(req.files, req.body.id, res, req.body.alt);
});

app.delete("/images/:public", verify, (req, res) => {
    imageData.deleteImage(req.params.public, res);
})

// admin routes 
app.post("/admin/register", verify, (req, res) => {
     adminData.registerAdmin(req.body, res);
});

app.post("/admin/login", (req, res) => {
    adminData.loginAdmin(req.body, res);
})



app.listen(port, () => console.log(`Server is running on port ${port}.`));
