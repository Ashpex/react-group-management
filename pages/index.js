import React, { useEffect, useState } from "react";
import ClassroomCards from "../src/components/ClassroomCards";
import { getSession } from "next-auth/react";
import httpRequest from "../src/api/httpRequest";

export default function Home({ session }) {
  const [groups, setGroups] = useState([]);

  const getAllGroups = async () => {
    try {
      const res = await httpRequest.get("/group/");
      setGroups(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllGroups();
  }, []);

  if (session) {
    return (
      <div className="">
        <main className="mt-4">
          <ClassroomCards groups={groups} />
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
