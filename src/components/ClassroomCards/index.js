import { Grid } from "@mui/material";
import React from "react";
import ClassroomCardItem from "../ClassroomCardItem";

function ClassroomCards() {
  return (
    <Grid container spacing={3} className="p-4">
      <Grid item xs={3}>
        <ClassroomCardItem />
      </Grid>
      <Grid item xs={3}>
        <ClassroomCardItem />
      </Grid>
      <Grid item xs={3}>
        <ClassroomCardItem />
      </Grid>
      <Grid item xs={3}>
        <ClassroomCardItem />
      </Grid>
    </Grid>
  );
}

export default ClassroomCards;
