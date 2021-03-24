'use strict';

import { NodeTracerProvider } from "@opentelemetry/node";
import { SimpleSpanProcessor, SpanExporter } from "@opentelemetry/tracing";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  CollectorTraceExporter,
  CollectorExporterNodeConfigBase,
} from "@opentelemetry/exporter-collector";

const collectorOptions: CollectorExporterNodeConfigBase = {
  serviceName: 'server',
  url: `http://otel-agent-service:55681/v1/trace`,
}

const provider = new NodeTracerProvider();
const exporter = new CollectorTraceExporter(collectorOptions);

const myExporterWithLoggingHellYeah: SpanExporter = {
  export: (spans, resultCallback) => {console.log("Some data going out"); console.log(spans);},
  shutdown: async () => {console.log("I was asked to shut up!");},
};

// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.addSpanProcessor(new SimpleSpanProcessor(myExporterWithLoggingHellYeah));
provider.register();

registerInstrumentations({
  tracerProvider: provider,
});

console.log("Tracing initialized");
console.log(exporter);
