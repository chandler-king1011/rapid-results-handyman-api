const mysql = require("mysql");
const dbConfig = require("../database/database");
const cloudinary = require('cloudinary').v2;

const dbConn = mysql.createPool(dbConfig);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

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

    postJob = (jobObj, files, res) => {
        if (files) {
            cloudinary.uploader.upload(files.image.tempFilePath, 
                (error, results) => {
                    if (error) {
                        res.status(400).send({message: "Could not upload image to Cloudinary.", error: error});
                    } else {
                        let jobInsertData = {
                            job_title: jobObj.title,
                            job_description: jobObj.description,
                            job_main_img_url: results.secure_url,
                            job_image_public: results.public_id
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
                })
            } else {
                res.status(400).send({message: "Jobs must contain an image. Please try again."});
            }
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
    deleteJobRecord = (id, res) => {
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
    deleteJobImage = (id, publicId, res) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (result.result == "not found") {
                res.status(404)({message: "Unable to locate image."});
            } else {
                this.deleteJobRecord(id, res)
            }
        })
    }
}

module.exports = Jobs;
