const { User } = require('../models');

module.exports = {
    //get all users
    getAllUsers(req, res){
        User.find()
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(500).json(err))
    },
    //get a single user by id
    getSingleUser(req, res){
        User.findOne({_id: req.params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(userData => {
                if (!userData){
                    res.status(404).json({ message: 'user does not exist, sorry!'})
                    return
                }
                res.status(200).json(userData)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    },
    //post method for creating a new user
    createUser(req, res){
        User.create(req.body)
            .then(newUser => res.status(200).json(newUser))
            .catch(err => {
                res.status(500).json(err)
            })
    },

}