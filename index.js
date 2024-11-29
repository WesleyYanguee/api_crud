const express = require('express') //import express
const cors = require('cors') //import cors to fix errors
const mysql = require('mysql2')
require('dotenv').config() //connect dotenv
const app = express() 

app.use(cors()) //use cors to fix errors
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL) //use URL from .env file with name of DATABASE_URL

app.get('/', (req, res) => {
    res.send('Hello world!!')
})

app.get('/users', (req, res) => {
    connection.query(
        'SELECT * FROM users',
        function (err, results, fields) {
            res.send(results)
        }
    )
})

app.get('/users/:id', (req, res) => { //'/users/:id' to get specific data
    const id = req.params.id; 
    connection.query(
        'SELECT * FROM users WHERE id = ?', [id], // * = all data
        function (err, results, fields) {
            res.send(results)
        }
    )
})

app.post('/users', (req, res) => { //create new data
    connection.query(
        'INSERT INTO `users` (`fname`, `lname`, `username`, `password`, `avatar`) VALUES (?, ?, ?, ?, ?)', //'fname' file indicator
        [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.avatar],
         function (err, results, fields) {
            if (err) {
                console.error('Error in POST /users:', err);
                res.status(500).send('Error adding user');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

app.put('/users', (req, res) => { //update data
    connection.query(
        'UPDATE `users` SET `fname`=?, `lname`=?, `username`=?, `password`=?, `avatar`=? WHERE id =?', // 5 variables need to update this id
        [req.body.fname, req.body.lname, req.body.username, req.body.password, req.body.avatar, req.body.id],
         function (err, results, fields) {
            if (err) {
                console.error('Error in PUT /users:', err);
                res.status(500).send('Error updating user');
            } else {
                res.status(200).send(results);
            }
        }
    )
})

app.delete('/users', (req, res) => {
    connection.query(
        'DELETE FROM `users` WHERE id =?',
        [req.body.id],
         function (err, results, fields) {
            res.send(results)
        }
    )
})

app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})

// export the app for vercel serverless functions
module.exports = app;
