import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes';
import { APP_PORT, DB_URL } from './config';
import errorHandler from './middlewares/errorHandler';
const app = express();

// Database connection
mongoose = require('mongoose');

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('DB connected');
});

global.app = path.resolve(__dirname);

app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`));
