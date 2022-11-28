/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import styles from "./style.module.scss";
import { getSession } from "next-auth/react";

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
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

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
    console.log({ data });

    // try {
    //   const res = await axios.post(
    //     `${process.env.REACT_APP_API_URL}/auth/register`,
    //     {
    //       username: data.username,
    //       password: data.password,
    //     }
    //   );
    //   const { accessToken } = res.data;
    //   localStorage.setItem("accessToken", accessToken);

    //   alert("You have successfully signed up!");
    //   navigate("/signin");
    // } catch (err) {
    //   setError(err.response.data);
    // }
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
                setPasswordNotMatch(false);
              } else {
                setPasswordNotMatch(true);
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
              {errors?.repeatPassword ||
                (passwordNotMatch && (
                  <p className="text-red-500">
                    {errors?.repeatPassword?.message || "Password not match"}
                  </p>
                ))}
            </div>

            <div className="mt-[15px]">
              <button
                className={`${styles.btn} ${styles["btn-login"]} uppercase `}
              >
                sign up
              </button>
            </div>

            <div className="mt-[15px]">
              <button
                className={`${styles.btn} ${styles["btn-google"]} flex items-center justify-center gap-4`}
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
