import { Sequelize } from '@sequelize/core';
import { Category } from './models/Category';
import { Type } from './models/Type';
import { User } from './models/User';

const models = [User, Category, Type];

export const db = new Sequelize({
    dialect: 'postgres',
    database: process.env.DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    models,
});
