import { getSession } from "next-auth/react";
import React from "react";

function NewfeedPage() {
  return <div>NewfeedPage</div>;
}

export default NewfeedPage;

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
