const express = require("express");
const mongoose = require("mongoose");
const app = express();
const post = require("./routes/post");
const user = require("./routes/user");
const bodyParser = require("body-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authMiddleware");
const { JWT_SECRET_KEY } = require("./secretKey");

const port = process.env.port || 5000;
app.use(express.static("/public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/poetpad");

// create user and return created user
app.post("/api/register", async (req, res) => {
  try {
    // generated hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // save and return response
    const userObject = await newUser.save();

    // updating userObject without password field
    uObj = { ...userObject._doc };
    delete uObj.password;
    res.status(200).json(uObj);
  } catch (err) {
    console.log("Error : ", err);
    res.status(400).json(err);
  }
});

// authenticate user and return the user object
app.post("/api/login", async (req, res) => {
  try {
    const userObject = await userModel.findOne({ email: req.body.email });
    if (!userObject) {
      res.status(404).json("user not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      userObject.password
    );
    if (!validPassword) {
      res.status(400).json("wrong password");
    }

    // creating JWT
    const accessToken = jwt.sign(
      { email: userObject.email, id: userObject._id },
      JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // updating userObject without password field
    const uObj = { ...userObject._doc };
    delete uObj.password;

    res.status(200).json({ user: uObj, token: accessToken });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

app.use(authenticateToken);
app.use("/api/post", post);
app.use("/api/user", user);

app.post("/logout", (req, res) => {
  res
    .status(200)
    .json(
      "logout feature is not working right now token will be expire in 1 day"
    );
});

app.listen(port, () => {
  console.log("Server is running on port:5000...");
});
