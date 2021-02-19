const opentracing = require("opentracing");
const initJaegerTracer = require("jaeger-client").initTracer;

module.exports.initTracer = (serviceName) => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: true,
      agentHost: 'jaeger'
    },
  };
  const options = {
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
};

module.exports.inject = (tracer, span, http, method, url) => {
  span.setTag(opentracing.Tags.SPAN_KIND, opentracing.Tags.SPAN_KIND_RPC_CLIENT);
  span.setTag(opentracing.Tags.HTTP_METHOD, method);
  span.setTag(opentracing.Tags.HTTP_URL, url);
  tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, );
};
