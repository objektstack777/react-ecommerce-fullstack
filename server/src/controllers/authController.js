import {
  getUserProfile,
  loginUser,
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

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    console.error('Login error:', error.message);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Unable to log in',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(
      req.user.userId
    );

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(
      'Profile retrieval error:',
      error.message
    );

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Unable to retrieve profile',
    });
  }
};