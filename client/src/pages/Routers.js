import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import Course from "./Course";
import Courses from "./Courses";
import dataContext from "../utils/contextApi";
import { useContext } from "react";

const Routers = () => {
  const { isLogin } = useContext(dataContext);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:slug" element={<Course />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/login"
            element={isLogin ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isLogin ? <Navigate to="/" replace /> : <Signup />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routers;
