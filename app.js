const express = require("express");
const app = express();
const port = process.env.port || 5000;
const post = require("./routes/post");

app.use(express.static("/public"));

app.post("/login", (req, res) => {
  // authenticate user and return the user object
  res.status(200).send("success");
});

app.post("/signup", (req, res) => {
  // create user and return created user
  res.status(200).send("success");
});

function authorization(req, res, next) {
  next();
  // this method will authorize the user based on token get in request header.
}

app.use(authorization);
app.use("/post", post);

app.get("/", (req, res) => {
  res.status(200).send("<h1>hello</h1>");
});

app.get("/home", (req, res) => {
  // return all posts
  res.status(200).send("success");
});

app.get("/user/:id", (req, res) => {
  res.status(200).send("success");
});

app.listen(port, () => {
  console.log("Server is running on port:5000...");
});
