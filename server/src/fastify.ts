import fastify from 'fastify';
import cors from 'fastify-cors';
import { listings } from './listings';
const app = fastify();
const port = 9000;

app.register(cors);
app.get('/', async () => 'hello world');
app.get('/listings', async () => listings);
app.post<{ Body: { id: string } }>('/delete-listing', async (request) => {
  const id: string = request.body.id;
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return listings.splice(i, 1)[0];
    }
  }

  return 'failed to deleted listing';
});
app.listen(port);

console.log(`[app] : http://localhost:${port}`);
