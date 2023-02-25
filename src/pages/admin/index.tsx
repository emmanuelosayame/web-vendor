import LayoutA from "@components/Layout/Admin";
import { type NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return <div className="">dash</div>;
};
Dashboard.getLayout = function getLayout(page) {
  return <LayoutA nopx="all">{page}</LayoutA>;
};
export default Dashboard;
