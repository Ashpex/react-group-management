import React from "react";
import ClassroomCards from "../src/components/ClassroomCards";
import { getSession } from "next-auth/react";

export default function Home({ session }) {
  if (session) {
    return (
      <div className="">
        <main className="mt-4">
          <ClassroomCards />
        </main>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
