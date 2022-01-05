const express = require("express");
const { unfollowUser, followUser } = require("../controllers/userController");
const router = express.Router();
const userModel = require("../models/user");

const userObjectWithoutPassword = (userObject) => {
  const uObj = { ...userObject._doc };
  delete uObj.password;
  return uObj;
};

// return user object
router.get("/:id", async (req, res) => {
  // if id==loggedInUserId then return userObject
  // else return Object with limited fields
  try {
    const uid = req.params.id;
    const userObject = await userModel.findById(uid);
    const uObj = userObjectWithoutPassword(userObject);
    res.status(200).json(uObj);
  } catch (err) {
    res.status(400).json(err);
  }
});

// return updated user
router.put("/:id", (req, res) => {
  // it will update user when id==loggedInUserId

  res.status(200).send("success");
});

// return success after deleting the user
router.delete("/:id", async (req, res) => {
  // it will delete user if id==loggedInUserId
  try {
    if (req.params.id.length < 24) {
      return res.status(403).json("invalid user id");
    }
    if (req.params.id === req.headers.id) {
      const userObject = await userModel.findByIdAndDelete(req.params.id);
      res.status(200).json("success");
    } else {
      res.status(401).json("You have no access to delete this account");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/:id/follow", followUser);

router.post("/:id/unfollow", unfollowUser);

module.exports = router;
