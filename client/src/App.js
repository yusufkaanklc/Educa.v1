import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { DataProvider } from "./utils/contextApi";
import "./styles/globals.css";
import Routers from "./pages/Routers";
import theme from "./utils/theme";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <DataProvider>
        <ChakraProvider theme={theme}>
          <Routers />
        </ChakraProvider>
      </DataProvider>
    </BrowserRouter>
  );
};

export default App;
