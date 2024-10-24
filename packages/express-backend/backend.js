import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByJob = (job) => {
  return users["users_list"].filter(
    (user) => user["job"] === job
  )
};

const findUserByNameJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const removeUser = (id) => {
  const idx = users["users_list"].indexOf(findUserById(id));
  if (idx == -1) {
    res.status(404).send("Resource not found.");
  }
  users["users_list"].splice(idx, 1);
};

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  removeUser(id);
  res.status(204).send();
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = findUserByNameJob(name, job);
    result = { users_list: result };
    res.send(result);
  }
  else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  }
  else if (job != undefined) {
    let result = findUserByJob(job);
    result = { users_list: result };
    res.send(result);
  }
  else {
    res.send(users);
  }
});

const addUser = (user) => {
  if (!(user.id)) {
    user.id = Math.floor(Math.random() * 10000).toString();
  }
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd)
  let result = (findUserByName(userToAdd.name))
  if (result == undefined) {
    res.status(400).send("Bad Request")
  } else {
    res.status(201).send(result[0]);
  }
});