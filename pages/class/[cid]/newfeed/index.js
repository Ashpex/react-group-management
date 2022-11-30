import { Box } from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import MenuNavbar from "../../../../src/components/MenuNavbar";
import { useMenu } from "../../../../src/provider/MenuProvider";

function NewfeedPage({ session }) {
  const router = useRouter();

  const classId = router.query.cid;

  console.log(classId);

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
      NewfeedPage
    </div>
  );
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
