const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.static("/public"));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("<h1>hello</h1>");
});

app.get("/home", (req, res) => {
  res.status(200).send("success");
});

app.post("/login", (req, res) => {
  res.status(200).send("success");
});

app.post("/signup", (req, res) => {
  res.status(200).send("success");
});

app.get("/profile", (req, res) => {
  res.status(200).send("success");
});

app.listen(5000, () => {
  console.log("Server is running on port:5000...");
});
