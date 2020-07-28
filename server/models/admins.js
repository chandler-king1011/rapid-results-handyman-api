const mysql = require("mysql");
const dbConfig = require("../database/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
                                 res.status(401).send({message: "Could not register new admin. Make sure you are not using an email you have used in the past.", error: err});
                             } else {
                                 res.status(201).send({message: "You have successfully registered a new admin. They may now login.", response: results});
                             }
                         } )
                }
             })
        }
    

    loginAdmin(body, res) {
        let email = body.email;
        let password = body.password;

        dbConn.query("SELECT * FROM admin WHERE admin_email = ?", 
        [email],
        (err, results) => {
            if (err) {
                res.status(401).send({message: "Invalid email or password.", error: err});
            } else if (results.length === 0) {
                res.status(401).send({message: "Invalid email or password.", error: err});
            } else {
                bcrypt.compare(password, results[0].admin_password, (error, resolve) => {
                    if (resolve === true) {
                        let admin = {
                            id: results[0].admin_id,
                            firstName: results[0].admin_first_name,
                            lastName: results[0].admin_last_name,
                            email: results[0].admin_email
                        }
                        let token = jwt.sign(admin, process.env.SECRET_KEY);
                        res.status(200).send({token, admin});
                    }
                    else if (resolve === false) {
                        res.status(401).send({"message": "Invalid email or password."});
                    }
                })
            }
        })

    }

}

module.exports = Admin;