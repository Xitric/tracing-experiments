import express from 'express';
import {traceExtractor} from './tracing';
const app = express();
const port = 3000;

app.use(traceExtractor('info-service'));

app.get('/', (req, res) => {
  res.send('Here is some information: Lorem ipsum')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
