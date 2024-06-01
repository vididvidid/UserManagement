const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    logger.error('Mongoose connection error: ' + err );
});

mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose disconnected from MongoDB');
});

module.exports = mongoose;
