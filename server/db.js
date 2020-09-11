require('dotenv').config()

const mysql = require('mysql')
// const mysql = require('mysql2');
if (process.env.DB_HOST != "localhost") {
  console.log("If you aren't using docker, host incorrectly set.")
}
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


// This is the same as the function below!!!
const getConnected = (callback) => {
  pool.getConnection((err, connection) => {
    callback(err, connection)
  });
};
// const getConnected = function (callback) {
//   pool.getConnection((err, connection) => {
//     callback(err, connection)
//     return null
//   }) 
//   return null
// }


module.exports = {
  getConnected
}
