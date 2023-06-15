import { appRouter } from "src/server/routers/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "src/server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path}: ${error}`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
