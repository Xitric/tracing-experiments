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
}
