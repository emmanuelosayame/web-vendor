import { getCsrfToken } from "next-auth/react";
import Login from "./Client";

const Page = async () => {
  const csrfToken = await getCsrfToken();
  if (!csrfToken) throw new Error("FAILED TO GET CSRF TOKEN");
  return <Login csrfToken={csrfToken} />;
};

export default Page;
