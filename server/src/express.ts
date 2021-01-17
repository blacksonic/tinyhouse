import { connectDatabase } from './database';
import { createApp } from './express/app';
import { config } from './config';

const start = async () => {
  const db = await connectDatabase();

  const app = createApp(db);
  app.listen(config.port);

  console.log(`[app] : http://localhost:${config.port}`);
};

start().catch(console.error);
