import Layout from "@components/Layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useStore } from "store";
import { api } from "utils/api";
import { type NextPageWithLayout } from "../_app";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const colorScheme = useStore((state) => state.colorScheme);
  const changeCS = useStore((state) => state.setColorScheme);

  const { data } = api.user.one.useQuery({});

  const user = useSession();

  console.log(user);

  return <>profile</>;
};

Profile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default Profile;
