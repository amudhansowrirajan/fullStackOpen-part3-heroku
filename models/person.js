const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  number: {
    type: Number,
    min: 9999,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("person", personSchema);

module.exports = Person;

// if (process.argv.length === 5) {
//   const entry = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   entry.save().then((result) => {
//     console.log(`note saved`, result);
//     mongoose.connection.close();
//   });
// } else if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
//     console.log("---PhoneBook---");
//     result.forEach((person) => {
//       console.log(`${person.name}: ${person.number}`);
//     });
//     console.log("------------");
//     mongoose.connection.close();
//   });
// }
