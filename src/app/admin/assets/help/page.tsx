"use client";

import Select from "@components/radix/Select";
import { MenuFlex } from "@components/TElements";
import { useRouter } from "next/navigation";
// import { assetsSelectList } from "@lib/list";

const Assets = () => {
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
          selectList={[]}
        />
      </MenuFlex>
      <div className="outer-box h-[97%]">
        <div className="inner-box"></div>
      </div>
    </>
  );
};

export default Assets;
