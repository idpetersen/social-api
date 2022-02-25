const { User } = require("../models");

module.exports = {
  //get all users
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.status(200).json(users))
      .catch((err) => res.status(500).json(err));
  },
  //get a single user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "user does not exist, sorry!" });
          return;
        }
        res.status(200).json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //post method for creating a new user
  createUser(req, res) {
    User.create(req.body)
      .then((newUser) => res.status(200).json(newUser))
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //Updating user by Id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
      runValidators: true,
      new: true,
    })
      .then((updateUser) => {
        if (!updateUser) {
          res.status(404).json({ message: "user does not exist, sorry!" });
          return;
        }
        res.status(200).json(updateUser);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //Find user and delete it
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((deleteUser) => {
        if (!deleteUser) {
          res.status(404).json({ message: "user does not exist, sorry!" });
          return;
        }
        res.status(200).json(deleteUser);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //Adding a friend by userId and friendId
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((newFriend) => {
        if (!newFriend) {
          res.status(404).json({ message: "friend does not exist, sorry!" });
          return;
        }
        res.status(200).json(newFriend);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //Delete friend by userId and FriendID
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((badFriend) => {
        if (!badFriend) {
          res.status(404).json({ message: "friend does not exist, sorry!" });
          return;
        }
        res.status(200).json(badFriend);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
