const express = require("express");
const { listen } = require("express/lib/application");
const app = express();

app.get("/", (req, res) => {
  res.send("hello this is poetPad");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000...");
});
