const { Thought, User } = require("../models");

module.exports = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((thoughts) => res.status(200).json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  //get a single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "thought does not exist" });
          return;
        }
        res.status(200).json(thoughtData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //create thought with username
  createThought(req, res) {
    Thought.create(req.body)
      .then((newThought) => {
        return User.findOneAndUpdate(
          {
            username: req.body.usernmae,
          },
          { $push: { thoughts: newThought._id } },
          { runValidators: true, new: true }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "user does not exist" });
          return;
        }
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //update thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
      runValidators: true,
      new: true,
    })
      .then((updateThought) => {
        if (!updateThought) {
          res.status(404).json({ message: "thought does not exist, sorry!" });
          return;
        }
        res.status(200).json(updateThought);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //Find thought and delete it
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((deleteThought) => {
        if (!deleteThought) {
          res.status(404).json({ message: "thought does not exist, sorry!" });
          return;
        }
        res.status(200).json(deleteThought);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //add reaction to thought
  addReaction(req, res){
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reaction: req.body } },
        { runValidators: true, new: true }
      )
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((newReaction) => {
        if (!newReaction) {
          res.status(404).json({ message: "thought does not exist" });
          return;
        }
        res.status(200).json(newReaction);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //delete reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: {reactionId: req.params.reactionId }}},
      { new: true }
    )
      .then((deleteThought) => {
        if (!deleteThought) {
          res.status(404).json({ message: "friend does not exist, sorry!" });
          return;
        }
        res.status(200).json(deleteThought);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
