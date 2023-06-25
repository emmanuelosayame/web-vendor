import { prisma } from "src/server/db";
import Client from "./Client";
import type { RSCProps } from "@t/shared";

const getData = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error("failed to fetch");
    }

    return product;
  } catch (err) {
    const error = err as any;
    throw new Error(error);
  }
};

const ProductPage = async ({ params: { id } }: RSCProps) => {
  const data = await getData(id);
  // create fn to upload. formData with type first then json.stringify the rest of payload as "other"field.imagefiles and thumbnail field also variant field

  return (
    <>
      <Client data={data} />
    </>
  );
};

export default ProductPage;
