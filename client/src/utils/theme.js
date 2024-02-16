import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,

  fonts: {
    heading: " Montserrat, sans-serif;",
    body: "Poppins, sans-serif;",
  },
});

export default theme;
