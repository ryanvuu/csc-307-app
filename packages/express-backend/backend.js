import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
const { addUser, getUsers, findUserById, findUserByName, findUserByJob } = userService;

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// const findUserByJob = (job) => {
//   return users["users_list"].filter(
//     (user) => user["job"] === job
//   )
// };

// const findUserByNameJob = (name, job) => {
//   return users["users_list"].filter(
//     (user) => user["name"] === name && user["job"] === job
//   );
// };

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id

  findUserById(id)
  .then((user) => {
    res.send(user);
  })
  .catch((error) => {
    res.status(500).send(error);
  });

  // let result = findUserById(id);
  // if (result === undefined) {
  //   res.status(404).send("Resource not found.");
  // } else {
  //   res.send(result);
  // }
});

// const removeUser = (id) => {
//   const idx = users["users_list"].indexOf(findUserById(id));
//   if (idx == -1) {
//     res.status(404).send("Resource not found.");
//   }
//   users["users_list"].splice(idx, 1);
// };

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  removeUser(id);
  res.status(204).send();
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  getUsers(name, job)
  .then((userRetrieved) => {
    res.send(userRetrieved);
  })
  .catch((error) => {
    res.status(500).send(error);
  });

});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  addUser(userToAdd)
  .then((userAdded) => {
    res.status(201).send(userAdded);
  })
  .catch((error) => {
    res.status(400).send(error);
  })

});