const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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
// const logStream = fs.createWriteStream("./morgan.log");
app.use(
  morgan(
    ":method :url status-:status (:res[content-length]-:response-time ms) :post :user-agent"
  )
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

///////////////////////////////
///////////////////////////////
///////////////////////////////

// Routes

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!persons.map((person) => person.id).includes(id)) {
    return res.status(400).json({
      error: "invalid ID or Request",
    });
  }

  const person = persons.filter((person) => person.id === id);
  res.json(person);
});

app.get("/info", (req, res) => {
  res.send(
    `<h4>Phone book has Info for ${
      persons.length
    } people</h4> <p>${new Date().toString()}</p>`
  );
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // console.log(body);
  // console.log(req.headers);
  if (!body.name) {
    return res.status(400).json({
      error: "please enter a name",
    });
  }

  if (!body.number) {
    return res.status(400).send({
      error: "please enter a number",
    });
  }

  // check if the person already exists
  if (persons.map((person) => person.name).includes(body.name)) {
    return res.status(400).send({
      error: "this person already exists",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.ceil(Math.random() * 999999999),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  // console.log(id);
  persons = persons.filter((person) => person.id !== id);
  // console.log(persons);
  res.json(persons);
});

app.put("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "please enter a name",
    });
  }

  if (!body.number) {
    return res.status(400).send({
      error: "please enter a number",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  };

  persons = persons.filter((perp) => perp.id !== id).concat(person);
  console.log(persons);
  res.json(person);
});

///////////////////////////////
///////////////////////////////
///////////////////////////////

// CATCH ALL
const unknownEndPoint = (req, res) => {
  res.send("<h2>Unknown Endpoint<h2>");
};
app.use(unknownEndPoint);

///////////////////////////////
///////////////////////////////
///////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running on port 3001");
});

app;
