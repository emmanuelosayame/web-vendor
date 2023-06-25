"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { InputTemp } from "../../../components/InputTemp";
import { loginS, type LoginS } from "src/server/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

const Login = ({ csrfToken }: { csrfToken: string }) => {
  const login = async (values: LoginS) => {
    // await fetch("/api/auth/callback/credentials", {
    //   body: JSON.stringify({ ...values, csrfToken }),
    //   method: "POST",
    // });
    signIn("credentials", { callbackUrl: "/" }, values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm<LoginS>({ resolver: zodResolver(loginS) });

  return (
    <div className="inset-0 md:inset-0 fixed bg-neutral-600 z-30 bg-login-1">
      <div
        className="w-screen h-screen fixed inset-0 md:backdrop-blur-[2px] flex justify-center
         md:justify-end items-center"
      >
        <Image
          alt="logo"
          src="/logo5t.png"
          width={540}
          height={380}
          className="fixed left-10 top-5 w-56 md:w-72 drop-shadow-lg"
        />
        <div
          className="bg-white rounded-xl p-3 m-7 sm:m-10 md:mr-44 flex flex-col w-full sm:w-72
           items-center drop-shadow-xl gap-4"
        >
          <p className="text-lg text-black/60 font-semibold">
            sign in to your account
          </p>

          <form onSubmit={handleSubmit(login)} className="w-full space-y-2">
            <InputTemp
              label="Vendor Id"
              {...register("vendorId")}
              placeholder="Enter id"
              error={errors.vendorId?.message}
              touched={touchedFields.vendorId}
            />
            <InputTemp
              label="key"
              {...register("key")}
              placeholder="Enter key"
              error={errors.key?.message}
              touched={touchedFields.key}
            />
            <div className="pt-3">
              <button
                disabled={!isDirty}
                type="submit"
                className="w-full disabled:opacity-50 bg-red-600
                     hover:bg-red-700 rounded-xl p-2
             text-white drop-shadow-md"
              >
                login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
