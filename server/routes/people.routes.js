const express = require('express');
const router = express.Router();
const peopleCtrl = require("../controllers/people.controller.js");

// Create a new person
router.route("/people")
  .post(peopleCtrl.create);

// Retrieve all peopleCtrl
router.route("/people")
  .get(peopleCtrl.findAll);

// Retrieve a single person with personId
router.route("/people/:personId")
  .get(peopleCtrl.findOne);

// Update a person with personId
router.route("/people/:personId")
  .put(peopleCtrl.update);

// Delete a person with personId
router.route("/people/:personId")
  .delete(peopleCtrl.deletePerson);

// Create a new person
router.route("/people")
  .delete(peopleCtrl.deleteAll);

module.exports = router;