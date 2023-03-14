import { router } from "../trpc";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { storeRouter } from "./store";
import { vendorRouter } from "./vendor";
import { customerRouter } from "./customer";
import { categoryRouter } from "./category";
import { assetRouter } from "./asset";
import { notificationRouter } from "./notification";

export const appRouter = router({
  product: productRouter,
  store: storeRouter,
  vendor: vendorRouter,
  order: orderRouter,
  customer: customerRouter,
  category: categoryRouter,
  asset: assetRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
