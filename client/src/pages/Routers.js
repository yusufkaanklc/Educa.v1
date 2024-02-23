import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import Course from "./Course";
import AllCourses from "./AllCourses";
import { useContext, useEffect } from "react";
import dataContext from "../utils/contextApi";
import Cookies from "js-cookie";
import Account from "./Account";

const Routers = () => {
  const { isLogin, setIsLogin } = useContext(dataContext);

  const location = useLocation();

  useEffect(() => {
    setIsLogin(Cookies.get("isLoggedIn") ? true : false);

    console.log(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:slug" element={<Course />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route
          path="/login"
          element={isLogin ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLogin ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="/account"
          element={isLogin ? <Account /> : <Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
};

export default Routers;
