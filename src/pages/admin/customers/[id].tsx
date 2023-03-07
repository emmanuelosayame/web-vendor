import LayoutA from "@components/Layout/Admin";
import { type NextPageWithLayout } from "@t/shared";

const Customer: NextPageWithLayout = () => {
  return <>customer</>;
};

Customer.getLayout = function getLayout(page: any) {
  return <LayoutA>{page}</LayoutA>;
};

export default Customer;
