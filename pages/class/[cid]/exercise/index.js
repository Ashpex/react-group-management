import { Box } from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import MenuNavbar from "../../../../src/components/MenuNavbar";
import { useMenu } from "../../../../src/provider/MenuProvider";

function ClassExercise({ session }) {
  const router = useRouter();
  const classId = router.query.cid;

  const { currentTab, setCurrentTab } = useMenu();

  return (
    <div>
      <Box>
        <MenuNavbar
          classId={classId}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </Box>
      ClassExercise
    </div>
  );
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
