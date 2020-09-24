const Person = require("../models/people.model");


// Create and Save a new Person
const create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  };
  const person = new Person({
    email: req.body.email,
    name: req.body.name,
    active: req.body.active
  })

  Person.create(person, (err, data) => {
    if (err) {
      if (err.kind == "Name already in db") {  
        res.status(409).send({
          message: err.kind
        })
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Person."
        });
      }
    } else res.send(data);
  });
};


// Retrieve all Persons from the database.
const findAll = (req, res) => {
  Person.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving people."
      });
    else res.send(data);
  });
};

// Find a single Person with a PersonId
const findOne = (req, res) => {
  Person.findById(req.params.personId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with id ${req.params.personId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Person with id " + req.params.personId
        });
      }
    } else res.send(data);
  });
};

// Update a Person identified by the PersonId in the request
const update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Person.updateById(
    req.params.personId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Person with id ${req.params.personId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Person with id " + req.params.personId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Person with the specified PersonId in the request
const deletePerson = (req, res) => {
  Person.remove(req.params.PersonId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with id ${req.params.PersonId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Person with id " + req.params.PersonId
        });
      }
    } else res.send({ message: `Person was deleted successfully!` });
  });
};

// Delete all Persons from the database.
const deleteAll = (req, res) => {
  Person.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people."
      });
    else res.send({ message: `All People were deleted successfully!` });
  });
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deletePerson,
  deleteAll
}