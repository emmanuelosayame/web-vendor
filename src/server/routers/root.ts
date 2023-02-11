import { router } from "../trpc";
import { productRouter } from "./products";
import { storeRouter } from "./store";
import { userRouter } from "./user";

export const appRouter = router({
  product: productRouter,
  store: storeRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
