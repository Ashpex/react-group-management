import { Button } from "@mantine/core";

import GoogleIcon from "./googleIcon";

const GoogleButton = (props) => (
  <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />
);

export default GoogleButton;
