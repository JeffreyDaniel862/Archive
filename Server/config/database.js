import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize('Blog', 'postgres', process.env.POSTGRESPASS, {
  host: 'localhost',
  dialect:  'postgres'
});