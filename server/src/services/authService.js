import bcrypt from 'bcryptjs';

import {
  createUser,
  findUserByEmail,
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