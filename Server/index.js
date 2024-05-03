import express from 'express';
import './env.js'
import { db } from './config/database.js';
import authRoutes from './routes/auth.route.js';

const app = express();
app.use(express.json());

try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use('/jd/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running in port ${process.env.PORT}`);
})