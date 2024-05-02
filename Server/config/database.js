import { Sequelize } from 'sequelize';
import '../env.js'

export const db = new Sequelize('Blog', 'postgres', process.env.POSTGRESPASS, {
  host: 'localhost',
  dialect:  'postgres'
});