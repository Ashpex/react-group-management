/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

import styles from "./style.module.scss";

function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  //  const { status } = useSession();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     //   signIn("okta");
  //   } else if (status === "authenticated") {
  //     router.push("/");
  //   }
  // }, [router, status]);

  //   useEffect(() => {
  //     // const accessToken = localStorage.getItem("accessToken");
  //     // if (accessToken) {
  //     //   router.push("/");
  //     // }

  //     if (session) {
  //       console.log(123);
  //       router.push("/");
  //     }
  //   }, [status]);

  //   console.log({ session });

  //   const router = useRouter();
  //   const { status } = useSession();

  //   useEffect(() => {
  //     if (status === "unauthenticated") {
  //       console.log("No JWT");
  //       console.log(status);
  //       void signIn("okta");
  //     } else if (status === "authenticated") {
  //       return router.push("/");
  //     }
  //   }, [status]);

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
          className={`${styles["border-right-screen"]} py-[30px] pl-[60px] pr-[100px]`}
        >
          <p className="text-[30px] font-[400]">Login to your account</p>

          <form action="" className="w-full">
            <div className="mt-[60px]">
              <label htmlFor="email" className={styles.label}>
                EMAIL
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className={`${styles.textfield} mt-[8px]`}
                placeholder="Email"
              />
            </div>

            <div className="mt-[42px]">
              <label htmlFor="password" className={styles.label}>
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className={`${styles.textfield} mt-[8px]`}
                placeholder="Password"
              />
            </div>

            <div className="flex mt-[30px]">
              <input type="checkbox" className={styles.checkbox} />
              <p className="ml-[8px] text-[#5F5F5F] text-[14px] font-[700] uppercase">
                Remember me
              </p>
            </div>

            <div className="mt-[30px]">
              <button
                className={`${styles.btn} ${styles["btn-login"]} uppercase `}
              >
                sign in
              </button>
            </div>

            <div className="mt-[30px]">
              <button
                className={`${styles.btn} ${styles["btn-google"]} flex items-center justify-center gap-4`}
                onClick={(e) => {
                  //   e.preventDefault();
                  signIn();
                }}
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
              <p className="font-[600] text-[14px] text-[#007E94]">Sign Up</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
