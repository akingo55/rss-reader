import { context, trace } from "@opentelemetry/api";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import { getOperationAST } from "graphql";
import type { Plugin } from "graphql-yoga";

const logger = logs.getLogger("rss-reader.graphql");

function getDurationMs(startedAt: number) {
  return Math.round((performance.now() - startedAt) * 100) / 100;
}

export function createGraphQLObservabilityPlugin(): Plugin {
  return {
    onExecute({ args }) {
      const startedAt = performance.now();
      const operation = getOperationAST(args.document, args.operationName);
      const operationName =
        args.operationName ?? operation?.name?.value ?? "anonymous";
      const operationType = operation?.operation ?? "unknown";
      const span = trace.getActiveSpan();
      const attributes = {
        "graphql.operation.name": operationName,
        "graphql.operation.type": operationType,
      };

      span?.setAttributes(attributes);

      return {
        onExecuteDone() {
          const logAttributes = {
            ...attributes,
            "graphql.duration.ms": getDurationMs(startedAt),
          };

          span?.setAttributes(logAttributes);

          logger.emit({
            eventName: "graphql.execute",
            severityNumber: SeverityNumber.INFO,
            severityText: "INFO",
            body: "GraphQL operation executed",
            attributes: logAttributes,
            context: context.active(),
          });
        },
      };
    },
  };
}
