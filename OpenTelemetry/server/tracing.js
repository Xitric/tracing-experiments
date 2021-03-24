'use strict';

const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");

const provider = new NodeTracerProvider();

provider.register();

registerInstrumentations({
  tracerProvider: provider,
});

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    // new JaegerExporter({
    //   serviceName: 'server',
    //   // You can use the default UDPSender
    //   host: 'jaeger', // optional
    //   port: 6832, // optional
    //   // OR you can use the HTTPSender as follows
    //   // endpoint: 'http://localhost:14268/api/traces',
    //   maxPacketSize: 65000 // optional
    // })
    new CollectorTraceExporter({
      serviceName: 'server',
      url: `http://otel-agent-service:55681/v1/trace`,
    })
  )
);

console.log("tracing initialized");