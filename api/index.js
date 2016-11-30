import express from 'express';
import compression from 'compression';
import cors from 'cors';
import findHandler from './utils/find-handler';
import * as queries from './queries';
import { apiPort } from '../config';

const { env: { NODE_ENV } } = process;

const app = express();

app.use(compression());
app.use(cors());

app.use(async ({ url, method }, res) => {
  const handler = findHandler(queries, url, method);

  if (handler) {
    try {
      const result = await handler();

      res.send(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  res.status(404).end('Not found');
});

app.listen(apiPort, () => {
  console.log(`API server is listen on ${apiPort} port in ${NODE_ENV} mode.`);
});
