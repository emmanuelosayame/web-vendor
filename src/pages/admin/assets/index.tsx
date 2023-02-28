import LayoutA from "@components/Layout/Admin";
import { type NextPageWithLayout } from "src/pages/_app";

const Assets: NextPageWithLayout = () => {
  return <></>;
};

Assets.getLayout = function getLayout(page: any) {
  return <LayoutA>{page}</LayoutA>;
};

export default Assets;
