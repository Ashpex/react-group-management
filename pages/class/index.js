import { getSession } from "next-auth/react";
import React from "react";

export default function ClassPage() {
  return <div>ClassPage</div>;
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
