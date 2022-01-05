const express = require("express");
const mongoose = require("mongoose");
const app = express();
const post = require("./routes/post");
const user = require("./routes/user");
const bodyParser = require("body-parser");
const authenticateToken = require("./middleware/authMiddleware");
const { registerUser, loginUser } = require("./controllers/authController");
const { getProfile } = require("./controllers/userController");

const port = process.env.port || 5000;
app.use(express.static("/public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/poetpad");

// create user and return created user
app.post("/api/register", registerUser);

// authenticate user and return the user object
app.post("/api/login", loginUser);

app.use(authenticateToken);
app.use("/api/post", post);
app.use("/api/user", user);

app.get("/api/profile", getProfile);

app.post("api/logout", (req, res) => {
  res
    .status(200)
    .json(
      "logout feature is not working right now token will be expire in 1 day"
    );
});

app.listen(port, () => {
  console.log("Server is running on port:5000...");
});
