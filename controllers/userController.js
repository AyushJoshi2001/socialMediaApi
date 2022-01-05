const userModel = require("../models/user");
const postModel = require("../models/post");

const userObjectWithoutPassword = (userObject) => {
  const uObj = { ...userObject._doc };
  delete uObj.password;
  return uObj;
};

// returns current userObject
const getProfile = async (req, res) => {
  try {
    const uid = req.headers.id;
    const userObject = await userModel.findById(uid);
    const uObj = userObjectWithoutPassword(userObject);
    const postOfLoggedInUser = await postModel.find({ uid: uObj._id });
    res.status(200).json({ ...uObj, posts: postOfLoggedInUser });
  } catch (err) {
    res.status(400).json(err);
  }
};

const getUser = async (req, res) => {
  // if id==loggedInUserId then return userObject
  // else return Object with limited fields
  try {
    const uid = req.params.id;
    const userObject = await userModel.findById(uid);
    const uObj = userObjectWithoutPassword(userObject);
    const postOfLoggedInUser = await postModel.find({ uid: uObj._id });
    res.status(200).json({ ...uObj, posts: postOfLoggedInUser });
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteUser = async (req, res) => {
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
};

const followUser = async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.headers.id;

  if (userId !== currentUserId) {
    if ((userId.length < 24) | (currentUserId.length < 24)) {
      return res.status(403).json("invalid user id");
    }

    try {
      const user = await userModel.findById(userId);
      const currentUser = await userModel.findById(currentUserId);
      if (currentUser && user) {
        // update database
        if (!user.followers.includes(currentUserId)) {
          await userModel.findByIdAndUpdate(userId, {
            $push: { followers: currentUserId },
          });
          await userModel.findByIdAndUpdate(currentUserId, {
            $push: { followings: userId },
          });

          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you already follow this user");
        }
      } else {
        res.status(403).json("invalid user id");
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    res.status(403).json("You cannot follow youself");
  }
};

const unfollowUser = async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.headers.id;

  if (userId !== currentUserId) {
    if ((userId.length < 24) | (currentUserId.length < 24)) {
      return res.status(403).json("invalid user id");
    }

    try {
      const user = await userModel.findById(userId);
      const currentUser = await userModel.findById(currentUserId);
      if (currentUser && user) {
        // update database
        if (user.followers.includes(currentUserId)) {
          await userModel.findByIdAndUpdate(userId, {
            $pull: { followers: currentUserId },
          });
          await userModel.findByIdAndUpdate(currentUserId, {
            $pull: { followings: userId },
          });

          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you do not follow this user");
        }
      } else {
        res.status(403).json("invalid user id");
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    res.status(403).json("You cannot follow youself");
  }
};

module.exports = { followUser, unfollowUser, deleteUser, getUser, getProfile };
