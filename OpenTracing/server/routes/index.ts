import {Tags} from 'opentracing';
import {Router} from 'express';
import * as http from 'superagent';
import { requestTracer, TracedRequest } from '../tracing';
var router = Router();

/* GET home page. */
router.get('/', async function(req: TracedRequest, res, next) {
  const span = req.span;
  const tracer = req.tracer;

  try {

    span.log({
      event: 'Getting a greeting!'
    });
    const msg = await http
        .get('http://service_hello:3000/')
        .use(requestTracer(span, tracer));

    span.log({
      event: 'Getting some information!'
    });
    const info = await http
        .get('http://service_info:3000/')
        .use(requestTracer(span, tracer));
    
    span.log({
      event: 'Rendering page!'
    });
    res.render('index', { title: 'Express', message: msg.text, info: info.text });

  } catch (err) {
    res.render('index', { title: 'Express', message: 'Internal server error' });
  }
});

export default router;
