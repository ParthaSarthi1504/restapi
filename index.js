require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();


// request body-parser
app.use(express.json());


//database conection
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    database: 'restapi',
    password: ''
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected Successfully!");
});


// get users
app.get('/user', (req, res) => {
    try{
        let sqlQuery = "SELECT * FROM  users";
        db.query(sqlQuery, (err, result) => {
            if (err) throw err;
            res.status(200).json(result)
        })

    }catch(e){
        res.status(400).json({ message: e.message })
    }
})


// Register
app.post('/user/register', (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            res.status(400).json({ message: "Enter Valid Email or Username or Password" });
        }

        let sqlQuery = "SELECT * FROM  users WHERE email = ?";

        db.query(sqlQuery, [email], async(err, result) => {
            if (err) throw err;
            if (!result.length) { // if length = 0 the user is not there
                // password hashing
                const encryptedPassword = await bcrypt.hash(password, 10);
                sqlQuery = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
                db.query(sqlQuery, [username, email, encryptedPassword], (err, result) =>{
                    if (err) throw err;
                    res.status(200).json({message: "User Registered Successfully"})
                })
            } else {
                res.status(200).json({ message: "user already Exist" });
            }
        });

    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})


app.listen(process.env.PORT, () => {
    console.log("Server Successfully Running on the Port : " + process.env.PORT)
})