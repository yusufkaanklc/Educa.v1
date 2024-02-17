import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { DataProvider } from "./utils/contextApi";
import "./styles/globals.css";
import theme from "./utils/theme";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <DataProvider>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home></Home>} />
              {/* <Route path="/about" element={<About />} /> */}
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </DataProvider>
    </>
  );
};

export default App;
