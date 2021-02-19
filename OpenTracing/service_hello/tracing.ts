import { FORMAT_HTTP_HEADERS, Span, Tags, Tracer } from 'opentracing';
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

function traceExtractor(name: string): RequestHandler {
  const tracer = initTracer(name);

  return (req: TracedRequest, res, next) => {
    let span: Span;
    const parentSpanCtx = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
    if (parentSpanCtx == null) {
      span = tracer.startSpan(`${req.method} ${req.url}`);
    } else {
      span = tracer.startSpan(`${req.method} ${req.url}`, { childOf: parentSpanCtx });
    }

    span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_SERVER);

    req.tracer = tracer;
    req.span = span;

    res.on('finish', () => {
      span.finish();
    });
    next();
  }
}

interface TracedRequest extends Request {
  span: Span,
  tracer: Tracer,
}

export {
  initTracer,
  traceExtractor,
  TracedRequest,
};
