// graphql/resolvers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../schema/user')
const { UserInputError } = require('apollo-server-errors');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    'your_secret_key',
    { expiresIn: '1h' }
  );
};

module.exports = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req) throw new Error('Request object is not available');
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error('Authorization header must be provided');

      const token = authHeader.split('Bearer ')[1];
      if (!token) throw new Error('Authentication token must be \'Bearer [token]\'');

      try {
        const user = jwt.verify(token, 'your_secret_key');
        return await User.findById(user.id);
      } catch (err) {
        throw new Error('Invalid/Expired token');
      }
    }
  },
  Mutation: {
    register: async (_, { firstName, lastName, mobile, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new UserInputError('email is taken', {
        errors: {
          email: 'This email is taken'
        }
      });

      const newUser = new User({
        firstName,
        email,
        password,
        lastName,
        mobile
      });
      try {
        const res = await newUser.save();
        const token = generateToken(res);
        return {
          ...res._doc,
          id: res._id,
          token
        };
      }catch(err){
       console.log(err)
      }
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new UserInputError('User not found', {
        errors: {
          email: 'User not found'
        }
      });

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new UserInputError('Wrong credentials', {
        errors: {
          password: 'Wrong credentials'
        }
      });

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  }
};
