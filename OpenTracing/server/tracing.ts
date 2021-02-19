import {Plugin} from 'superagent';
import { Span, Tags, Tracer, FORMAT_HTTP_HEADERS } from 'opentracing';
import {
  initTracer as initJaegerTracer,
  TracingConfig,
  TracingOptions
} from "jaeger-client";
import {Request, RequestHandler} from 'express';

function initTracer(serviceName: string): Tracer {
  const config: TracingConfig = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: true,
      agentHost: 'jaeger'
    }
  }

  const options: TracingOptions = {
    logger: {
      info(msg) {
        console.log("INFO ", msg);
      },
      error(msg) {
        console.error("ERROR", msg);
      },
    },
  };

  return initJaegerTracer(config, options);
}

function traceInjector(name: string): RequestHandler {
  const tracer = initTracer(name);

  return (req: TracedRequest, res, next) => {
    const span = tracer.startSpan(`${req.method} ${req.url}`);
    req.tracer = tracer;
    req.span = span;

    res.on('finish', () => {
      span.finish();
    });
    next();
  }
}

function requestTracer(parent: Span, tracer: Tracer): Plugin {
  const span = tracer.startSpan('superagent.request', { childOf: parent });

  return (req) => {
    span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT);
    span.setTag(Tags.HTTP_METHOD, req.method);
    span.setTag(Tags.HTTP_URL, req.url);

    const headers = {};
    tracer.inject(span.context(), FORMAT_HTTP_HEADERS, headers)

    span.log({
      event: 'Some request headers',
      headers
    });

    req.set(headers);
    req.on('error', (err: Error) => {
      if (err) {
        span.setTag(Tags.ERROR, true);
        span.log({
          event: 'error',
          message: err.message,
          stack: err.stack,
        });
      }
    });

    req.on('response', (res) => {
      span.finish();
    })
  };
}

interface TracedRequest extends Request {
  span: Span,
  tracer: Tracer,
}

export {
  initTracer,
  traceInjector,
  requestTracer,
  TracedRequest,
};
