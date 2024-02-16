import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./styles/globals.css";
import theme from "./utils/theme";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home></Home>} />
            {/* <Route path="/about" element={<About />} /> */}
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
};

export default App;
