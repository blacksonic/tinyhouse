import express, { Application } from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';

dotenv.config({});

import { typeDefs, resolvers } from './graphql';
import { Database } from './lib/types';
import { connectDatabase } from './database';
import { config } from './config';

export const createApp = (db: Database): Application => {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req, res }) => ({ db, req, res }) });

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(cookieParser(process.env.SECRET));
  app.use(express.json());
  app.use(cors());
  app.use(compression());
  app.use(express.static(`${__dirname}/client`));
  app.get('/*', (_req, res) => res.sendFile(`${__dirname}/client/index.html`));
  server.applyMiddleware({ app, path: '/api' });
  app.get('/', (req, res) => res.send('hello world'));
  app.post('/statusDone', (req, res) =>
    res.send({
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }),
  );

  return app;
};

const start = async () => {
  const db = await connectDatabase();

  const app = createApp(db);
  app.listen(config.port);

  console.log(`[app] : http://localhost:${config.port}`);
};

start().catch(console.error);
