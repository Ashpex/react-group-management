import { getSession } from "next-auth/react";
import React from "react";

function ClassExercise() {
  return <div>ClassExercise</div>;
}

export default ClassExercise;

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
