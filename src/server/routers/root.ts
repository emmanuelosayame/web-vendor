import { router } from "../trpc";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { storeRouter } from "./store";
import { vendorRouter } from "./vendor";
import { customerRouter } from "./customer";

export const appRouter = router({
  product: productRouter,
  store: storeRouter,
  vendor: vendorRouter,
  order: orderRouter,
  customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
