
import mongoose,{ConnectOptions} from 'mongoose';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri: string = process.env.MONGODB_URI || ' ';

if(!mongoUri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}

// mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

mongoose.connection.on('connected',()=>{
    logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error',(err:Error)=>{
    logger.error('Mongoose connection error: '+ err);
});

mongoose.connection.on('disconnected',()=>{
    logger.info('Mongoose disconnected from MongoDB');
});

export default mongoose;