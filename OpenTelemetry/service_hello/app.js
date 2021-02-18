const express = require('express')
const opentelemetry = require('@opentelemetry/api');
// const { diag } = require("@opentelemetry/api");
const app = express()
const port = 3000

const tracer = opentelemetry.trace.getTracer('@service_hello/app');

app.get('/', (req, res) => {
  // diag.error("Ah fuck");
  span = tracer.startSpan('get /');
  span.recordException(new Error("Ah fuck"));
  res.send('Hello from the service!')
  span.end();
})

app.listen(port, () => {
  // console.error("Ah fuck, an error");
  console.log(`Example app listening at http://localhost:${port}`)
})
