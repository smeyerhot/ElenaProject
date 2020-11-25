const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../db')


const signin =  (req, res, next) => {
  console.log(req.body);
  db.getConnected(function(err, connection) {
    console.log(connection)
  connection.query(`SELECT * FROM User WHERE username = ${connection.escape(req.body.username)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      // console.log(result)
      if (!result.length) {
        return res.status(401).send({
          msg: 'Username or password is incorrect!'
        });
      }

      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }

          if (bResult) {
            const token = jwt.sign({
                username: result[0].username,
                userId: result[0].uuid
              },
              'SECRETKEY', {
                expiresIn: '7d'
              }
            );
            res.cookie("t", token, {
              expire: new Date() + 9999
            })
            connection.query(
              `UPDATE User SET last_login = now() WHERE uuid = '${result[0].uuid}'`
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          } else {
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
          }
        }
      );
    }
  );
  connection.release()
});

};

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    msg: "signed out "
  })
}


module.exports = {
  signin,
  signout,
}
