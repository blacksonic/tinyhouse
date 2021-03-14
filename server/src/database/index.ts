import { MongoClient } from 'mongodb';
import { config } from '../config';
import { Database, Booking, Listing, User } from '../lib/types';

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });
  const db = client.db('main');

  return {
    disconnect: () => client.close(true),
    bookings: db.collection<Booking>('bookings'),
    listings: db.collection<Listing>('listings'),
    users: db.collection<User>('users'),
  };
};
