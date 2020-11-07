require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("post", function (req, res) {
  if (req.body.name) {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

app.use(
  morgan(
    ":method :url status-:status (:res[content-length]-:response-time ms)\n:post\n:user-agent"
  )
);

///////////////////////////////
///////////////////////////////
///////////////////////////////

// Routes

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
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

app.post("/api/persons", (req, res, next) => {
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

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => res.json(result))
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
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

///////////////////////////////
///////////////////////////////
///////////////////////////////

// CATCH ALL UNKNOWNENDPOINTS (MiddleWare)
const unknownEndPoint = (req, res) => {
  res.send("<h2>Unknown Endpoint<h2>");
};
app.use(unknownEndPoint);

///////////////////////////////
///////////////////////////////
///////////////////////////////

// ERROR HANDLING (MiddleWare)

const errorHandler = (error, req, res, next) => {
  // console.log(error);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformed request" });
  } else if (error.name === "ValidationError") {
    console.log("----validation Error----");
    console.log("----validation Error----");

    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

///////////////////////////////
///////////////////////////////
///////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running on port 3001");
});

app;
