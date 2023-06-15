import { prisma } from "src/server/db";
import VendorClient from "./Client";
import { getServerAuthSession } from "src/server/auth";
import type { RSCProps } from "@t/shared";

const getData = async (vid: string | undefined) => {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "admin")
    throw new Error("UNAUTHENTICATED");

  if (vid === "new") return null;

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vid },
    });
    if (!vendor) {
      throw new Error("failed to fetch");
    }

    return vendor;
  } catch (err) {
    const error = err as any;
    throw new Error(error);
  }
};

const VendorPage = async ({ params }: RSCProps) => {
  const vendor = await getData(params.vendor);

  return (
    <>
      <VendorClient vendor={vendor} vid={params.vendor as string} />
    </>
  );
};

export default VendorPage;
