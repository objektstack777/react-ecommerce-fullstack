import 'dotenv/config';

import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Express API running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Unable to start the server:',
      error.message
    );

    process.exit(1);
  }
};

startServer();