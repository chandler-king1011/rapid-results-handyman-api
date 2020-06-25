const mysql = require("mysql");
const dbConfig = require("../database/database");
const dbConn = mysql.createPool(dbConfig);

class Jobs {
    getAllJobs = (res) => {
        dbConn.query("SELECT * FROM job",
        (err, results) => {
            if (err != null) {
                res.status(404).send({message: "Unable to retrieve Job data.", error: err});
            } else if (err == null) {
                res.status(200).send({response: results, error: null});
            }
        })
    }

    getSingleJob = (id, res) => {
        dbConn.query("SELECT * FROM job WHERE job_id = ?",
        [id],
        (err, results) => {
            if (err != null) {
                res.status(404).send({message: "Unable to find requested job data.", error: err});
            } else if (err == null) {
                res.status(200).send({response: results, error: null});
            }
        })
    }

    postJob = (jobObj, res) => {
        let jobInsertData = {
            job_title: jobObj.title,
            job_description: jobObj.description
        }
        dbConn.query("INSERT INTO job SET ?",
        [jobInsertData],
        (err, results) => {
            if (err != null) {
                res.status(400).send({message: "Unable to post job. Please try again later.", error: err});
            } else if (err == null) {
                res.status(201).send({message: "The job has been posted.", response: results, error: null});
            }
        })
    }

    updateJob = (id, jobObj, res) => {
        let jobUpdateData = {
            job_title: jobObj.title,
            job_description: jobObj.description
        }
        dbConn.query("UPDATE job SET ? WHERE job_id = ?",
        [jobUpdateData, id],
        (err, results) => {
            if(err != null) {
                res.status(400)({message: "Job could not be updated. Please try again later.", error: err});
            } else if (err == null) {
                res.status(200).send({message: "Job has been updated.", response: results, error: null});
            }
        });
    }

    deleteJob = (id, res) => {
        dbConn.query("DELETE FROM job WHERE job_id = ?",
        [id],
        (err, results) => {
            if (err != null) {
                res.status(404).send({message: "Job could not be deleted.", error: err});
            } else if (err == null) {
                res.status(200).send({message: "Job has been deleted.", error: null, response: results});
            }
        })
    }
}

module.exports = Jobs;
