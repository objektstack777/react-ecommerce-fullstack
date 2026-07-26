import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authorizationHeader =
      req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    const token = authorizationHeader.split(' ')[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};