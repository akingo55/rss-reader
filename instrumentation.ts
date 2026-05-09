import { registerOTel } from "@vercel/otel";
import { logs } from "@opentelemetry/api-logs";

export async function register() {
  registerOTel({
    serviceName: "rss-reader",
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const {
      LoggerProvider,
      SimpleLogRecordProcessor,
      ConsoleLogRecordExporter,
    } = await import("@opentelemetry/sdk-logs");

    const loggerProvider = new LoggerProvider({
      processors: [new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())],
    });
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
