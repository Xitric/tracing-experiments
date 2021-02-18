'use strict';

const { LogLevel } = require("@opentelemetry/core");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

// const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
// diag.setLogger(new DiagConsoleLogger())

// And optionally change the logging level (Defaults to INFO)
// diag.setLogLevel(DiagLogLevel.ERROR);

const provider = new NodeTracerProvider({
  
});

registerInstrumentations({
  tracerProvider: provider,
});

provider.register();

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      serviceName: 'service_hello',
      // You can use the default UDPSender
      host: 'jaeger', // optional
      port: 6832, // optional
      // OR you can use the HTTPSender as follows
      // endpoint: 'http://localhost:14268/api/traces',
      maxPacketSize: 65000 // optional
    })
  )
);

console.log("tracing initialized");