import Sequelize from 'sequelize';

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

export const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
}); 

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}