import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { listings } from './listings';
const app = new Koa();
const router = new Router();
const port = 9000;

router.get('/', (ctx) => (ctx.body = 'hello world'));
router.get('/listings', (ctx) => (ctx.body = listings));
router.post('/delete-listing', (ctx) => {
  const id: string = ctx.request.body.id;
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      ctx.body = listings.splice(i, 1)[0];
      return;
    }
  }

  ctx.body = 'failed to deleted listing';
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);

console.log(`[app] : http://localhost:${port}`);
