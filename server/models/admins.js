const mysql = require("mysql");
const dbConfig = require("../database/database");
const bcrypt = require("bcrypt");

const dbConn = mysql.createPool(dbConfig);
const saltRounds = 10;


class Admin {
    registerAdmin(body, res) {
        bcrypt.hash(body.password, saltRounds, 
            (err, hash) => {
                if (err) {
                    res.status(400).send({message: "Could not secure password. Try again later.", error: err});
                } else {
                    const sqlScript = "INSERT INTO admin(admin_first_name, admin_last_name, admin_email, admin_password) VALUES(?, ?, ?, ?)";
                    dbConn.query(sqlScript,
                        [body.firstName,
                         body.lastName,
                         body.email,
                         hash], 
                         (err, results) => {
                             if(err) {
                                 res.status(400).send({message: "Could not register new admin. Make sure you are not using an email you have used in the past.", error: err});
                             } else {
                                 res.status(201).send({message: "You have successfully registered a new admin. They may now login.", response: results});
                             }
                         } )
                }
             })
        }
    

    saveToken(email, token) {

    }

    loginUser(body, res) {
        let email = body.email;
        let password = body.password;

        dbConn.query("SELECT * FROM admin WHERE admin_email = ?", 
        [email],
        (err, results) => {
            if (err) {
                res.status(404).send({message: "Invalid email or password.", error: err});
            } else {
                bcrypt.compare(password, results[0].admin_password, (error, resolve) => {
                    if (resolve === true) {
                        
                    }
                })
            }
        })

    }

}

module.exports = Admin;