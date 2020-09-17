// const db = require('../db')


// const getOrders = async (req, res) => {
//     db.getConnected(function(err, connection) {
//         connection.query('SELECT * FROM orders', (err,rows) => {
//             if(err) throw err;
        
//                 console.log('Data received from Db:');
//                 res.json(rows)
//             });
//     connection.release()
//     });
// };

// module.exports = {
//     getOrders,
// };
