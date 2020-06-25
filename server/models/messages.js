const mysql = require("mysql");
const sgMail = require('@sendgrid/mail');

const dbConfig = require("../database/database");
const dbConn = mysql.createPool(dbConfig);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Message {
    getAllMessages = (res) => {
        dbConn.query("SELECT * FROM message",
        (err, results) => {
            if (err) {
                res.status(404).send({message: "Cannot retrieve data. Please try again later.", error: err});
            } else {
                res.status(200).send({response: results, error: null});
            }
        });
    }

    getSingleMessage = (id, res) => {
        dbConn.query("SELECT * FROM message WHERE message_id = ?",
        [id],
        (err, results) => {
            if (err != null) {
                res.status(404).send({message: "Message could not be found.", error: err});
            } else if (err == null) {
                res.status(200).send({response: results, error: null});
            }
        })
    }

    sendMessage = (jobMsg, res) => {
        const msg = {
            to: process.env.DELIVERY_EMAIL,
            from: jobMsg.email,
            subject: `${jobMsg.jobType} Job Request`,
            text: `${jobMsg.description} 


            From: ${jobMsg.name}`
        }
        sgMail.send(msg);
        res.status(200).send({message: "Your message has been sent!", error: null});
    }

    postMessage = (jobMsg, res) => {
        let jobMsgInsert = {
            message_name : jobMsg.name,
            message_email: jobMsg.email,
            message_jobType: jobMsg.jobType,
            message_description: jobMsg.description
        }
        dbConn.query("INSERT INTO message SET ?", 
        [jobMsgInsert],
        (err, results) => {
            if (err != null) {
                res.status(400).send({message: "An error occurred when trying to post your message. Please try again later.", error: err});
            } else if (err == null) {
                this.sendMessage(jobMsg, res);
            }
        })
    }

    deleteMessage = (msgId, res) => {
        dbConn.query("DELETE FROM message WHERE message_id = ?", 
        [msgId],
        (err, results) => {
            if(err) {
                res.status(404).send({message: "Message does not exist.", error: err});
            } else if (err == null) {
                res.status(200).send({message: "Message has been deleted.", error: null});
            }
        })
    }


}




module.exports = Message;