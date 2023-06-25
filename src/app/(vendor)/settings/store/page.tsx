"use client";
import { InputTemp, TextareaTemp } from "@components/InputTemp";
import Layout from "@components/layout";
import StoreComponent from "@components/StoreComponent";
import { IconBack, IconButton, MenuFlex } from "@components/TElements";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useStore } from "store";
import { api } from "@lib/api";
import { type NextPageWithLayout } from "t/shared";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const colorScheme = useStore((state) => state.colorScheme);
  const changeCS = useStore((state) => state.setColorScheme);

  // const { data } = api.vendor.one.useQuery({});

  const { data } = api.store.one.useQuery({});

  return (
    <>
      <MenuFlex>
        <IconBack>
          <p>Cancel</p>
          <XMarkIcon width={25} />
        </IconBack>

        <IconButton>
          <p>Edit</p>
          <PencilSquareIcon width={25} />
        </IconButton>
      </MenuFlex>

      <div className="w-full h-full overflow-y-auto pb-2">
        <StoreComponent edit={true} store={data} id="fetch" isAdmin={false} />
      </div>
    </>
  );
};

Profile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default Profile;
