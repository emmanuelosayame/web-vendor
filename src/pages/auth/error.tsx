import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

const Error = () => {
  const router = useRouter();
  const error = router.query.error?.toString();

  const user = useSession().data?.user;
  if (user) router.replace("/");
  return (
    <div className="w-screen h-screen bg-neutral-200 flex flex-col justify-center items-center text-white">
      <div className="rounded-lg bg-neutral-400 p-3 text-center">
        <h3>{error || "error"}</h3>
        {error === "AccessDenied" ? (
          <>
            <p>{"You don't have permission to sign-in"}</p>
            <button
              onClick={() => signIn("github")}
              className="py-1 px-3 text-sm rounded-lg hover:bg-neutral-200
             bg-white mt-5 text-neutral-800"
            >
              Sign In
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Error;
