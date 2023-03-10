import LayoutA from "@components/Layout/Admin";
import Select from "@components/radix/Select";
import { MenuFlex } from "@components/TElements";
import { type NextPageWithLayout } from "@t/shared";
import { useRouter } from "next/router";
import { assetsSelectList } from "utils/list";

const Assets: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <MenuFlex>
        <Select<string>
          triggerStyles="w-fit bg-white"
          onValueChange={(page) => {
            router.replace(`/admin/assets/${page}`);
          }}
          defaultSelected="help"
          selectList={assetsSelectList}
        />
      </MenuFlex>
      <div className="outer-box h-[97%]">
        <div className="inner-box"></div>
      </div>
    </>
  );
};

Assets.getLayout = function getLayout(page: any) {
  return <LayoutA>{page}</LayoutA>;
};

export default Assets;
