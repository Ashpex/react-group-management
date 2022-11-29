/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./style.module.scss";
import { getSession, signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import httpRequests from "../../src/api/httpRequest";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const RegisterSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup.string().required("Vui lòng nhập password"),
  repeatPassword: yup.string().required("Vui lòng nhập repeat password"),
});

function RegisterPage() {
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit = async (data) => {
    setIsFetching(true);
    try {
      const res = await httpRequests.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res?.data?.data?.token);
      setIsFetching(false);

      setTimeout(() => {
        router.push("/");
      }, 3000);

      toast.success(res?.data?.message, {
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.message);
      setIsFetching(false);
    }
  };

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
        <div
          className={`${styles["border-right-screen"]} pl-[60px] pr-[100px]`}
        >
          <p className="text-[30px] font-[400]">Register new account</p>

          <form
            className="w-full mt-[10px]"
            onSubmit={handleSubmit((data) => {
              if (data.password === data.repeatPassword) {
                onSubmit(data);
                setError("");
              } else {
                setError("Password and repeat password are not the same");
              }
            })}
          >
            <div>
              <label htmlFor="email" className={styles.label}>
                NAME
              </label>
              <input
                {...register("name")}
                type="text"
                className={`${styles.textfield} mt-[8px]`}
                placeholder="Name"
              />
              {errors?.name && (
                <p className="text-red-500">{errors?.name?.message}</p>
              )}
            </div>

            <div className="mt-[10px]">
              <label htmlFor="email" className={styles.label}>
                EMAIL
              </label>
              <input
                {...register("email")}
                type="text"
                id="email"
                className={`${styles.textfield} mt-[8px]`}
                placeholder="Email"
              />
              {errors?.email && (
                <p className="text-red-500">{errors?.email?.message}</p>
              )}
            </div>

            <div className="mt-[10px]">
              <label htmlFor="password" className={styles.label}>
                PASSWORD
              </label>
              <input
                {...register("password")}
                type="password"
                className={`${styles.textfield} mt-[8px]`}
                placeholder="Password"
              />
              {errors?.password && (
                <p className="text-red-500">{errors?.password?.message}</p>
              )}
            </div>

            <div className="mt-[10px]">
              <label htmlFor="password" className={styles.label}>
                CONFIRM PASSWORD
              </label>
              <input
                {...register("repeatPassword")}
                type="password"
                className={`${styles.textfield} mt-[8px]`}
                placeholder="Confirm Password"
              />
              {(errors?.repeatPassword || error) && (
                <p className="text-red-500">
                  {errors?.repeatPassword?.message || error}
                </p>
              )}
            </div>

            <div className="mt-[15px]">
              <button
                className={`${styles.btn} ${styles["btn-login"]} uppercase ${
                  isFetching ? "cursor-not-allowed opacity-60" : ""
                }`}
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "sign up"
                )}
              </button>
            </div>

            <div className="mt-[15px]">
              <button
                className={`${styles.btn} ${
                  styles["btn-google"]
                } flex items-center justify-center gap-4 ${
                  isFetching ? "cursor-not-allowed opacity-60" : ""
                }`}
                onClick={() => signIn()}
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

            <div className="flex items-center justify-center gap-3 mt-2">
              <p className="font-[400] text-[14px]">Have an account?</p>
              <Link href={"/login"}>
                <p className="font-[600] text-[14px] text-[#007E94]">Sign In</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegisterPage;

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
