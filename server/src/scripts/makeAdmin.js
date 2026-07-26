import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';

const email = process.argv[2]?.trim().toLowerCase();

const makeAdmin = async () => {
  try {
    if (!email) {
      throw new Error(
        'Provide an email address after the command'
      );
    }

    await connectDatabase();

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          role: 'admin',
        },
      },
      {
        returnDocument: 'after',
      }
    );

    if (!user) {
      throw new Error(
        `No user was found with email ${email}`
      );
    }

    console.log(
      `${user.email} is now an admin`
    );
  } catch (error) {
    console.error(
      'Admin update failed:',
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

makeAdmin();