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
// const list = async (req, res) => {
//   try {
//     connection.query(`SELECT username, registered = require(User`, (err,rows) => {
//     res.json(rows)})
//   } 
//   catch (err) {
//     return res.status(400).json({
//       msg: err
//     })
//   }
// }
// const list = async (req, res) => {
//   try {
//     await connection.query(`SELECT username, registered = require(User`, (err,rows) => {
//     res.json(rows)})
//   } 
//   catch (err) {
//     return res.status(400).json({
//       msg: err
//     })
//   }
// }


// const create = async (req, res) => {
//   const user = new User(req.body)
//   try {
//     await user.save()
//     return res.status(200).json({
//       message: "Successfully signed up!"
//     })
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

// /**
//  * Load user and append to req.
//  */
// const userByID = async (req, res, next, id) => {
//   try {
//     let user = await User.finconnectionyId(id)
//     if (!user)
//       return res.status('400').json({
//         error: "User not found"
//       })
//     req.profile = user
//     next()
//   } catch (err) {
//     return res.status('400').json({
//       error: "Could not retrieve user"
//     })
//   }
// }

// const read = (req, res) => {
//   req.profile.hashed_password = undefined
//   req.profile.salt = undefined
//   return res.json(req.profile)
// }


// const update = async (req, res) => {
//   try {
//     let user = req.profile
//     user = extend(user, req.body)
//     user.updated = Date.now()
//     await user.save()
//     user.hashed_password = undefined
//     user.salt = undefined
//     res.json(user)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

// const remove = async (req, res) => {
//   try {
//     let user = req.profile
//     let deletedUser = await user.remove()
//     deletedUser.hashed_password = undefined
//     deletedUser.salt = undefined
//     res.json(deletedUser)
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err)
//     })
//   }
// }

module.exports = {
  create,
  list
}
