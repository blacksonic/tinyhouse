import express, { Application } from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config({});

import { typeDefs, resolvers } from './graphql';
import { Database } from './lib/types';
import { connectDatabase } from './database';
import { config } from './config';

export const createApp = (db: Database): Application => {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req, res }) => ({ db, req, res }) });

  app.use(cookieParser(process.env.SECRET));
  server.applyMiddleware({ app, path: '/api' });
  app.use(express.json());
  app.use(cors());
  app.get('/', (req, res) => res.send('hello world'));

  return app;
};

const start = async () => {
  const db = await connectDatabase();

  const app = createApp(db);
  app.listen(config.port);

  console.log(`[app] : http://localhost:${config.port}`);
};

start().catch(console.error);
