const { AuthenticationError } = require('apollo-server-express');
const {User} = require('../models')
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

        getAllUsers: async () => {
            return User.find();
        },

        getSingleUser: async (parent, {userId}) => {
            return User.find({_id: userId})
        }
    },

    Mutation: {

        createUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password})
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email })

            if(!user) {
                throw new AuthenticationError('No User Found')
            }

            const correctPw = await user.isCorrectPassword(password)

            if(!correctPw) {
                throw new AuthenticationError('Incorrect Password')
            }

            const token = sigToken(user);
            return {token, user}
        }
    }
}

module.exports = resolvers;