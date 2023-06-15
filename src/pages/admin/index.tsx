import LayoutA from "@components/layout/Admin";
import { type NextPageWithLayout } from "t/shared";

const Dashboard: NextPageWithLayout = () => {
  return <div className="">dash</div>;
};
Dashboard.getLayout = function getLayout(page) {
  return <LayoutA nopx="all">{page}</LayoutA>;
};
export default Dashboard;
