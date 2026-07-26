import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../repositories/userRepository.js';

export const registerUser = async ({
  name,
  email,
  password,
  salutation = '',
  marketingPreferences = [],
  country = '',
}) => {
  if (!name || !email || !password) {
    const error = new Error(
      'Name, email and password are required'
    );
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error(
      'Password must contain at least 8 characters'
    );
    error.statusCode = 400;
    throw error;
  }

  const normalisedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(
    normalisedEmail
  );

  if (existingUser) {
    const error = new Error(
      'An account already exists with this email'
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await createUser({
    name: name.trim(),
    email: normalisedEmail,
    passwordHash,
    salutation,
    marketingPreferences,
    country,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async ({
  email,
  password,
}) => {
  if (!email || !password) {
    const error = new Error(
      'Email and password are required'
    );
    error.statusCode = 400;
    throw error;
  }

  const normalisedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(
    normalisedEmail
  );

  if (!user) {
    const error = new Error(
      'Invalid email or password'
    );
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    const error = new Error(
      'Invalid email or password'
    );
    error.statusCode = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is missing from the server environment'
    );
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getUserProfile = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};