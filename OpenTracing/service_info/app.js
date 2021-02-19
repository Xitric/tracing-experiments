const express = require('express')
var {initTracer} = require('./tracing');
const app = express()
const port = 3000

var tracer = initTracer('service_info');

app.use(function (req, res, next) {
  const span = tracer.startSpan(`${req.method} ${req.url}`);
  res.on('finish', () => {
    span.finish();
  });
  next();
});

app.get('/', (req, res) => {
  res.send('Here is some information: Lorem ipsum')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
