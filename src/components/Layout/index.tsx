import Header from "@components/Header";
import type { ReactNode } from "react";
import { api } from "utils/api";
import { useStore } from "store";
import { csToStyle } from "utils/helpers";

const Layout = ({ children }: { children: ReactNode }) => {
  const colorScheme = useStore((state) => state.colorScheme);
  // const { data } = api.store.one.useQuery({ storeId: "" });

  const { bg } = csToStyle(colorScheme);

  // console.log(bg);

  return (
    <div className={`inset-0 h-full w-full bg-blue-600 `}>
      <div
        className=" flex relative w-full flex-col items-center overflow-y-auto
       bg-white bg-opacity-25 pt-20 h-screen px-2 pb-4"
      >
        <Header userdata={{}} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
