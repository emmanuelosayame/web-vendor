import { signIn } from "next-auth/react";
import Image from "next/image";
import github from "public/github.svg";

const Login = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <div className="inset-0 md:inset-2 fixed bg-blue-500  bg-login-1 md:bg-login-1 rounded-none md:rounded-xl z-30">
        <div
          className="w-screen h-screen fixed inset-0 md:backdrop-blur-[2px] flex justify-center
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
            {/* <Formik initialValues={{ id: "", password: "" }} onSubmit={login}>
              {({ dirty, getFieldProps }) => (
                <Form className="w-full space-y-2">
                  <InputTemp
                    heading="Vendor Id"
                    fieldProps={getFieldProps("id")}
                    placeholder="Enter id"
                  />
                  <InputTemp
                    heading="Password"
                    fieldProps={getFieldProps("password")}
                    placeholder="Enter password"
                  />
                  <div className="pt-3">
                    <button
                      disabled={!dirty}
                      type="submit"
                      className="w-full disabled:opacity-50 bg-blue-600
                     hover:bg-blue-700 rounded-lg p-1
             text-white drop-shadow-md"
                      onClick={() => signIn("github")}
                    >
                      login
                    </button>
                  </div>
                </Form>
              )}
            </Formik> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
