import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../../src/env/server.mjs";
import { createTRPCContext } from "../../../server/trpc";
import { appRouter } from "../../../server/routers/root";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});
