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
                res.status(404).send("Cannot retrieve data. Please try again later.");
            } else {
                res.status(200).send(results);
            }
        });
    }

    getSingleMessage = (id, res) => {
        dbConn.query("SELECT * FROM message WHERE message_id = ?",
        [id],
        (err, results) => {
            if (err != null) {
                res.status(404).send("Message could not be found.");
            } else if (err == null) {
                res.status(200).send(results);
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
        res.status(200).send("Your message has been sent!");
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
                res.status(400).send("An error occurred when trying to post your message. Please try again later.");
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
                res.status(404).send("Message does not exist.");
            } else if (err == null) {
                res.status(200).send("Message has been deleted.");
            }
        })
    }


}




module.exports = Message;