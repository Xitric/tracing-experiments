'use strict';

const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

const provider = new NodeTracerProvider();

provider.register();

registerInstrumentations({
  tracerProvider: provider,
});

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      serviceName: 'server',
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