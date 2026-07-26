import {
  registerUser,
} from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: 'Registration successful',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error.message);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Unable to register user',
    });
  }
};