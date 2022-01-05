const userModel = require("../models/user");

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

module.exports = { followUser, unfollowUser };
