import LayoutA from "@components/Layout/Admin";
import { type NextPageWithLayout } from "src/pages/_app";

const Customer: NextPageWithLayout = () => {
  return <>customer</>;
};

Customer.getLayout = function getLayout(page: any) {
  return <LayoutA>{page}</LayoutA>;
};

export default Customer;
