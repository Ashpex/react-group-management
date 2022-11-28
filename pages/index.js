import React from "react";
import ClassroomCards from "../src/components/ClassroomCards";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <div>
        <p>Not signed in</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  localStorage.setItem("user", JSON.stringify(session.user));
  localStorage.setItem("accessToken", session.accessToken);

  return (
    <div className="">
      <main className="mt-4">
        <ClassroomCards />
      </main>
    </div>
  );
}
