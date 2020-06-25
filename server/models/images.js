const mysql = require("mysql");
const dbConfig = require("../database/database");
const cloudinary = require('cloudinary').v2;

const dbConn = mysql.createPool(dbConfig);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

class Images {

    getAllImages = (res) => {
        dbConn.query("SELECT * FROM image", 
        (err, results) => {
            if(err != null) {
                res.status(404).send({message: "There was an error receiving all images.", error: err, response: results});
            } else if (err == null) {
                res.status(200).send({message: "Images have been retrieved successfully.", response: results, error: null});
            }
        });
    }

    getJobImages = (jobId, res) => {
        dbConn.query("SELECT * FROM image WHERE image_job_id = ?",
        [jobId], 
        (err, results) => {
            if(err != null) {
                res.status(404).send({message: "There was an error receiving all images.", error: err, response: results});
            } else if (err == null) {
                res.status(200).send({message: "Images have been retrieved successfully.", response: results, error: null});
            }
        });
    }

    getSingleImage = (imageId, res) => {
        dbConn.query("SELECT * FROM image WHERE image_id = ?",
        [imageId], 
        (err, results) => {
            if(err != null) {
                res.status(404).send({message: "There was an error receiving this image.", error: err, response: results});
            } else if (err == null) {
                res.status(200).send({message: "Image has been retrieved successfully.", response: results, error: null});
            }
        });
    }

    postImage = (jobId, imgUrl, publicId, res) => {
        let imgInsert = {
            image_url: imgUrl,
            image_public: publicId,
            image_job_id: jobId
        };
        dbConn.query("INSERT INTO image SET ?", 
        [imgInsert],
        (err, results) => {
            if (err != null) {
                res.status(400).send({message: "Image was uploaded to cloudinary, but it was not saved within the database.", error: err, response: results})
            } else if (err == null) {
                res.status(201).send({message: "Image has been uploaded and saved.", response: results});
            }
        })
    }

    uploadImage = (files, jobId, res) => {
        cloudinary.uploader.upload(files.image.tempFilePath, 
            (error, result) => {
                if (error) {
                    res.status(400).send({message: "Could not upload image to Cloudinary.", error: error});
                } else {
                    console.log(result.public_id);
                    this.postImage(jobId, result.secure_url, result.public_id, res);
                }
        })
    }

    deleteImageRecords = (publicId, res) => {
        dbConn.query("DELETE FROM image WHERE image_public = ?",
        [publicId],
        (err, results) => {
            if(err != null) {
                res.status(400).send({message: "Image was deleted from Cloudinary, but the record was not deleted.", error: err, response: results});
            } else if (err == null) {
                res.status(200).send({message: "Image was successfully deleted.", error: null, response: results});
            }
        })
    }

    deleteImage = (publicId, res) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (result.result == "not found") {
                res.status(404)({message: "Unable to locate image."});
            } else {
                this.deleteImageRecords(publicId, res);
            }
        })
    }


}

module.exports = Images;