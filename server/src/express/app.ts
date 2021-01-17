import express, { Application } from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { listings } from '../listings';
import { typeDefs, resolvers } from './graphql';
import { Database } from '../types';

export const createApp = (db: Database): Application => {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers, context: { db } });

  server.applyMiddleware({ app, path: '/api' });
  app.use(express.json());
  app.use(cors());
  app.get('/', (req, res) => res.send('hello world'));
  app.get('/listings', (req, res) => res.send(listings));
  app.post('/delete-listing', (req, res) => {
    const id: string = req.body.id;
    for (let i = 0; i < listings.length; i++) {
      if (listings[i].id === id) {
        return res.send(listings.splice(i, 1)[0]);
      }
    }

    return res.send('failed to deleted listing');
  });

  return app;
};
