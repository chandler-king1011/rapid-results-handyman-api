const mysql = require("mysql");
const dbConfig = require("../database/database");
const dbConn = mysql.createPool(dbConfig);

class Jobs {
    getAllJobs = (res) => {
        dbConn.query("SELECT * FROM job",
        (err, results) => {
            if (err != null) {
                res.status(404).send("Unable to retrieve Job data.");
            } else if (err == null) {
                res.status(200).send(results);
            }
        })
    }

    getSingleJob = (id, res) => {
        dbConn.query("SELECT * FROM job WHERE job_id = ?",
        [id],
        (err, results) => {
            if (err != null) {
                res.status(404).send("Unable to find requested job data.");
            } else if (err == null) {
                res.status(200).send(results);
            }
        })
    }
}

module.exports = Jobs;
