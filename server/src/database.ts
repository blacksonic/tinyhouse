import { MongoClient } from 'mongodb';
import { config } from './config';
import { Database } from './types';

const url = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });
  const db = client.db('main');

  return {
    disconnect: () => client.close(true),
    listings: db.collection('listings'),
  };
};
