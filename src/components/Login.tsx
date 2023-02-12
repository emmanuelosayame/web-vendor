import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { TStack } from "./TElements";
import github from "public/github.svg";

const Login = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <div className="inset-3 fixed bg-login rounded-xl z-30">
        <div
          className="w-screen h-screen fixed inset-0 bg-white/5 backdrop-blur-[2px] flex justify-center
         md:justify-end items-center"
        >
          <div
            className="bg-white rounded-xl p-3 m-7 sm:m-10 md:mr-44 flex flex-col w-full sm:w-72
           items-center drop-shadow-xl gap-4"
          >
            <p className="text-lg text-neutral-700">sign in to your account</p>
            <Image
              alt="github"
              src={github}
              className="w-12 h-12 drop-shadow-md"
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-1
             text-white drop-shadow-md"
              onClick={() => signIn("github")}
            >
              login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
