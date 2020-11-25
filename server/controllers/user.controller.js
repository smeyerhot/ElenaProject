const jwt = require('jsonwebtoken')
const { v4 : uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')
const db = require('../db')


// Justification for 409 status code -> https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists

const create = async (req, res) => {
  db.getConnected(function(err, connection) {
    connection.query(
      `SELECT * FROM User WHERE LOWER(username) = 
      LOWER(${connection.escape(req.body.username)});`, (err, result,something) => {

        if (result.length) {
          return res.status(409).send({
            msg: 'This username is already taken!'
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              })
            } else {
              connection.query(
                `INSERT INTO User (uuid, username, email, password, registered)
                VALUES ('${uuidv4()}', ${connection.escape(req.body.username)},
                ${connection.escape(req.body.email)},
                ${connection.escape(hash)}, now())`,
                (err, result) => {
                  if (err) {
                    return res.status(400).send({
                      msg:err
                    });
                  }
                  return res.status(200).send({
                    msg: 'Registered!'
                  });
                }
              );
            }
          });
        }
    }
  );
  connection.release();
  });
};


// User.find().select('name email updated created')
// const list = async (req, res) => {
//   try {
//     let users = await connection.query(`SELECT username, registered = require(User`)
//     console.log(users)
//     res.json(users)
//   } catch (err) {
//     return res.status(400).json({
//       msg: err
//     })
//   }
// }
const list = async (req, res) => {
  try {
    db.getConnected(function(err, connection) {
      connection.query(`SELECT username, registered FROM User`, (err,rows) => {
      res.json(rows)})
    connection.release();
  });
  } 
  catch (err) {
    return res.status(400).json({
      msg: err
    })
  }
}

module.exports = {
  create,
  list
}
