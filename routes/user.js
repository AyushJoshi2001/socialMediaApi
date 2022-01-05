const express = require("express");
const {
  unfollowUser,
  followUser,
  deleteUser,
  getUser,
} = require("../controllers/userController");
const router = express.Router();

// return user object
router.get("/:id", getUser);

// return updated user
router.put("/:id", (req, res) => {
  // it will update user when id==loggedInUserId
  res.status(200).send("Update user feature is not available yet!");
});

// return success after deleting the user
router.delete("/:id", deleteUser);

router.put("/:id/follow", followUser);

router.put("/:id/unfollow", unfollowUser);

module.exports = router;
