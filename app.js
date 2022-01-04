const express = require("express");
const mongoose = require("mongoose");
const app = express();
const post = require("./routes/post");
const user = require("./routes/user");
const bodyParser = require("body-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const userPostMappingModel = require("./models/userPostMapping");

const JWT_SECRET_KEY = "ThisIsSecretKeyForJsonWebToken";

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
      JWT_SECRET_KEY
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

// this method will authorize the user based on token get in request header.
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.headers = { ...req.headers, id: payload.id };
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
}

app.use(authenticateToken);
app.use("/api/post", post);
app.use("/api/user", user);

// app.get("/", (req, res) => {
//   res.status(200).send("<h1>hello</h1>");
// });

app.listen(port, () => {
  console.log("Server is running on port:5000...");
});
