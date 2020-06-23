const mysql = require("mysql");
const sgMail = require('@sendgrid/mail');

const dbConfig = require("../database/database");
const dbConn = mysql.createPool(dbConfig);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Message {
    
}


module.exports = Message;