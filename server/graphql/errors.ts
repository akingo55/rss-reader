import { GraphQLError } from "graphql";
import { ZodError } from "zod";
import { Prisma } from "@/app/generated/prisma/client";

export function toGraphQLError(error: unknown) {
  if (error instanceof ZodError) {
    return new GraphQLError("Invalid input", {
      extensions: {
        code: "BAD_USER_INPUT",
        issues: error.issues,
      },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return new GraphQLError("Resource not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (error.code === "P2002") {
      return new GraphQLError("Resource already exists", {
        extensions: { code: "CONFLICT" },
      });
    }
  }

  return error;
}

