// @ts-nocheck
const db = require('../db');

// import { PersonData } from '@/types';


// const Person = function(this, config: PersonData) {
//     this.email = config.email;
//     this.name = config.name;
//     this.active = config.active;
// }

const Person = function(person) {
    this.email = person.email;
    this.name = person.name;
    this.active = person.active;
}
//Result is a callback from the controller function
Person.create = (newPerson, result) => {

    db.getConnected(function(err, connection) {

        connection.query(`SELECT * FROM people WHERE LOWER(name) = 
        LOWER(${connection.escape(newPerson.name)});`, (err, res) => {
         
        if (!res.length) {
            connection.query('INSERT INTO people SET ?', newPerson, (err,res) => {
                if (err) {
                    console.log("error: ", err)
                    result(err);
                } else {
                    console.log("created person", { id: res.insertId, ...newPerson });
                    // First argument is the err and Second argument is the data 
                    result(null, {id: res.insertId, ...newPerson})
                }
            })
        } else {
            result({ kind: "Name already in db"}, null);
        }
        connection.release();
        })
    });
}

Person.findById = (personId, result) => {
    db.getConnected((err, connection) => {

        connection.query(`SELECT * FROM people WHERE id = ${personId}`, (err, res) => {
            if (err) {
                console.log('error:', err);
                result(null, err)
                return;
            }

            if (res.length) {
                console.log("found person:", res[0])
                result(null, res[0]);
            }

            result({ kind: "not_found"}, null);
        });
        connection.release();
    });

}


Person.getAll = result => {
    db.getConnected(function(err, connection) {

        connection.query('SELECT * FROM people', (err, res) => {
            if (err) {
                console.log('error:', err);
                result(null, err)
                return;
            }

            console.log("people in the system:", res);
        })
        connection.release();
    });
}

Person.updateById = (id, person, result) => {
    db.getConnected(function(err, connection) {
        const query = "UPDATE persons SET email = ?, name = ?, active = ? WHERE id = ?";
        const interpolate = [people.email, people.name, people.active, id]
        const callback = (err, res) => {
            if (err) {
                console.log('error:', err);
                result(null, err)
                return;
            } else if (res.affectedRows == 0) {
                // not found person with the id
                result({ kind: "not_found" }, null);
                return;
            } else {
                console.log("updated person: ", { id: id, ...person });
                result(null, { id: id, ...person });
            }
        }
        connection.query(q, interpolate, callback)
        connection.release();
    });

}
Person.remove = (id, result) => {
    db.getConnected(function(err, connection) {
        const query = "DELETE FROM people WHERE id = ?";
        const interpolate = id;
        const callback = (err, res) => {
            if (err) {
                console.log('error:', err);
                result(null, err)
            } else if (res.affectedRows == 0) {
                // not found person with the id
                result({ kind: "not_found" }, null);
            } else {
                console.log("deleted person with id: ", id);
                result(null, res);
            }
        }
        connection.query(query, interpolate, callback);
        connection.release();
    });

}
Person.removeAll = result => {
    db.getConnected(function(err, connection) {
        const query = 'DELETE FROM people';
        const callback = (err, res) => {
            if (err) {
                console.log('error:', err);
                result(null, err)
            } else {
                console.log(`deleted ${res.affectedRows} people`);
                result(null, res);
            }
        }
        connection.query(query,callback);
        connection.release();
    });

}


function handleError(err, res) {
    if (err) {
        console.log('error:', err);
        result(null, err)
        return;
    }
}

module.exports = Person;

// const checkForDuplicates = (name,connection) => {
//     const query = `SELECT * FROM User WHERE LOWER(name) = 
//     LOWER(${connection.escape(name)});`
//     // const callback = (err, res) => {
//     //     if (err) {
//     //         return res.status(409).send("name is taken")
//     //     } else {
//     //         return res.status(200).send("Updated db")
//     //     }
//     // }
//     const rows = await connection.query(query)
//     console.log(rows)
//     if (rows.length > 1) {
//         return true; 
//     }
//     return false;

// }
// findByName = (personName, result) => {
//     db.getConnected((err, connection) => {

//         connection.query(`SELECT * FROM people WHERE name=${personName}`, (err, res) => {
//             if (err) {
//                 console.log('error:', err);
//                 result(null, err)
//                 return;
//             }

//             if (res.length) {
//                 console.log("found person:", res[0])
//                 result(null, res[0]);
//             }

//             result({ kind: "not_found"}, null);
//         });
//         connection.release();
//     });

// }
// const Teo = new Person();
// console.log(Teo.prototype)


// let f = function() {
//     this.a = 1;
//     this.b = 2;
// }

// let o = new f(); // {a: 1, b: 2}

// f.prototype.b = 3;
// f.prototype.c = 4;

// o.__proto__ == f.prototype // true

