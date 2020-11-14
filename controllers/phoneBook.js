const phoneBookRouter = require("express").Router();

const Person = require("../models/person");
const logger = require("../utils/logger");

phoneBookRouter.get("/info", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.send(
        `<h4>Amudhan's Phone book has Info for ${
          result.length
        } people</h4> <p>${new Date().toString()}</p>`
      );
    })
    .catch((error) => next(error));
});

phoneBookRouter.get("/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

phoneBookRouter.get("/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

phoneBookRouter.post("/persons", (req, res, next) => {
  const body = req.body;

  if (!Person.find({ name: body.name })) {
    return res.status(400).json({
      error: "this Person already exists",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((perp) => res.json(perp))
    .catch((error) => next(error));
});

phoneBookRouter.delete("/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => res.json(result))
    .catch((error) => {
      logger.error(error);
      next(error);
    });
});

phoneBookRouter.put("/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = phoneBookRouter;
