import User from '../models/User.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const findUserById = async (userId) => {
  return User.findById(userId).select(
    '-passwordHash -__v'
  );
};

export const createUser = async (userData) => {
  return User.create(userData);
};