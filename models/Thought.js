//Importing neccessary dependancies
const { Schema, model, Types } = require("mongoose");
const moment = require("moment");
//Not a model but has relation with the thought schema
const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timeStamp) => moment(timeStamp).format("MMMM Do YYYY, h:mm:ss a"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);
//This is a model that takes the reaction data and stores it in a key called reactions
const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timeStamp) => moment(timeStamp).format("MMMM Do YYYY, h:mm:ss a"),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);
//Gets the length of the reactions array that pertain to the individual thoought
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});
//Creating model with Thought's schema
const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
