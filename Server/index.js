import express from 'express';
import './env.js'
import { db } from './config/database.js';

const app = express();

try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.listen(process.env.PORT, () => {
    console.log(`Server is up and running in port ${process.env.PORT}`);
})