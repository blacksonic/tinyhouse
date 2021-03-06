import { connectDatabase } from '../database';
import { listings as defaultListings } from './listings';
import { users as defaultUsers } from './users';

const seed = async () => {
  try {
    console.log(`[seed] : running...`);
    const db = await connectDatabase();

    const bookings = await db.bookings.find({}).toArray();
    const listings = await db.listings.find({}).toArray();
    const users = await db.users.find({}).toArray();

    if (bookings.length > 0) {
      await db.bookings.drop();
    }

    if (listings.length > 0) {
      await db.listings.drop();
    }

    if (users.length > 0) {
      await db.users.drop();
    }

    for (const listing of defaultListings) {
      await db.listings.insertOne(listing);
    }

    for (const user of defaultUsers) {
      await db.users.insertOne(user);
    }

    console.log(`[seed] : success`);
    await db.disconnect();
  } catch (error) {
    console.error(error);
    throw new Error('failed to seed database');
  }
};

seed();
