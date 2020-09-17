// For some reason you must specify the getData function as async 
// There is an error if you try to import con from server - instead
// I import db from server
// const db = require('../db')


// const getData = async (req, res) => {
//     db.getConnected(function(err, connection) {
//         console.log(connection)
//         connection.query('SELECT * FROM customers', (err,rows) => {
//             if(err) throw err;
        
//             console.log('Data received from Db:');

//             res.json(rows)
//             })
//         connection.release()
//     });   
// }
// module.exports = {
//     getData,
// };
