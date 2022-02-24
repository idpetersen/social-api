//Importing neccessary dependancies
const { Schema, model, Types } = require('mongoose');
//This is a model to create a new user
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    //References the thought model so the user can have more than one thought. 
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    //Self referencing array for friendz
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

},
{
    toJSON: {
        virtuals: true,
    }
});

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length
});

const User = model('User', UserSchema);

module.exports = User