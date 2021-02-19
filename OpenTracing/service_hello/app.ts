import express from 'express';
import {traceExtractor} from './tracing';
const app = express();
const port = 3000;

app.use(traceExtractor('hello-service'));

app.get('/', (req, res) => {
  res.send('Hello from the service!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
