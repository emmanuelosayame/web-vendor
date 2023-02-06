import { router } from "../trpc";
import { productRouter } from "./products";

export const appRouter = router({
  example: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
