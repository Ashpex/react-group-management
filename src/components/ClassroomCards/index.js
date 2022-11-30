import { Grid } from "@mui/material";
import React from "react";
import ClassroomCardItem from "../ClassroomCardItem";

function ClassroomCards({ groups }) {
  return (
    <Grid container spacing={3} className="p-4">
      {(groups || []).map((group) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={group.id}>
          <ClassroomCardItem group={group} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ClassroomCards;
