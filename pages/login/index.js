/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import styles from "./style.module.scss";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import httpRequest from "../../src/api/httpRequest";

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup.string().required("Vui lòng nhập password"),
});

function LoginPage({ session }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LoginSchema),
  });

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setIsFetching(true);

    const user = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await httpRequest.post("/auth/login", user);
      await signIn("credentials", {
        redirect: true,
        ...res.data.data,
      });
      setError("");
    } catch (error) {
      setError(error.response.data.message);
    }

    setIsFetching(false);
  };

  if (!session) {
    return (
      <div className="w-screen h-screen overflow-hidden flex">
        <div className="w-[50vw] h-full bg-[#007E94] flex items-center justify-end">
          <div className={`${styles["border-left-screen"]} p-6`}>
            <div>
              <p className="text-[48px] font-[500] uppercase text-white ml-[10px]">
                classroom
              </p>

              <div className="flex items-center justify-center flex-col mt-[10px]">
                <img src="/images/connection.png" alt="" />

                <p className="text-[40px] font-[300] text-white mt-[60px]">
                  Connect with your friend
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[50vw] h-full bg-[#e2e3ea] flex items-center justify-start">
          <form
            className={`${styles["border-right-screen"]} py-[30px] pl-[60px] pr-[100px]`}
            onSubmit={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            <p className="text-[30px] font-[400]">Login to your account</p>

            <div className="w-full">
              <div className="mt-[60px]">
                <label htmlFor="email" className={styles.label}>
                  EMAIL
                </label>
                <input
                  {...register("email")}
                  type="text"
                  name="email"
                  id="email"
                  className={`${styles.textfield} mt-[8px]`}
                  placeholder="Email"
                />
                {errors?.email && (
                  <p className="text-red-500">{errors?.email?.message}</p>
                )}
              </div>

              <div className="mt-[42px]">
                <label htmlFor="password" className={styles.label}>
                  PASSWORD
                </label>
                <input
                  {...register("password")}
                  type="password"
                  name="password"
                  id="password"
                  className={`${styles.textfield} mt-[8px]`}
                  placeholder="Password"
                />
                {(errors?.password || error) && (
                  <p className="text-red-500">
                    {errors?.password?.message || error}
                  </p>
                )}
              </div>

              <div className="flex mt-[30px]">
                <input type="checkbox" className={styles.checkbox} />
                <p className="ml-[8px] text-[#5F5F5F] text-[14px] font-[700] uppercase">
                  Remember me
                </p>
              </div>

              <div className="mt-[30px]">
                <button
                  className={`${styles.btn} ${styles["btn-login"]} uppercase ${
                    isFetching ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "sign in"
                  )}
                </button>
              </div>

              <div className="mt-[30px]">
                <button
                  className={`${styles.btn} ${
                    styles["btn-google"]
                  } flex items-center justify-center gap-4 ${
                    isFetching ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                  disabled={isFetching}
                >
                  <img
                    src="/images/google.png"
                    alt=""
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                  <p>Continue with Google</p>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                <p className="font-[400] text-[14px]">
                  Don&apos;t have an account?
                </p>
                <Link href={"/register"}>
                  <p className="font-[600] text-[14px] text-[#007E94]">
                    Sign Up
                  </p>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

export default LoginPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
