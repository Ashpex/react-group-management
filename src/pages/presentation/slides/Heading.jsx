import { BackgroundImage, Group, Stack, Title } from "@mantine/core";
import React from "react";

import { isValidUrl } from "../../../utils";

function ColorBackground({ color, children }) {
  return (
    <div style={{ height: "100%", backgroundColor: color }}>{children}</div>
  );
}

function ImageBackground({ url, children }) {
  return (
    <BackgroundImage sx={{ height: "100%" }} src={url}>
      {children}
    </BackgroundImage>
  );
}

export default function HeadingDisplaySlide(props) {
  const { title, subTitle, background } = props;

  let Content = (
    <Group sx={{ height: "100%" }} position="center">
      <Stack align="center">
        <Title order={1}>{title}</Title>
        <Title order={3}>{subTitle}</Title>
      </Stack>
    </Group>
  );

  if (background) {
    Content = isValidUrl(background) ? (
      <ImageBackground url={background}>{Content}</ImageBackground>
    ) : (
      <ColorBackground color={background}>{Content}</ColorBackground>
    );
  }

  return Content;
}
