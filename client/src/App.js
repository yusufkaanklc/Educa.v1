import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { DataProvider } from "./utils/contextApi";
import "./styles/globals.css";
import Routers from "./pages/Routers";
import theme from "./utils/theme";

const App = () => {
  return (
    <DataProvider>
      <ChakraProvider theme={theme}>
        <Routers />
      </ChakraProvider>
    </DataProvider>
  );
};

export default App;
