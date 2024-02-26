import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import Course from "./Course";
import AllCourses from "./AllCourses";
import Dashboard from "./Dashboard";
import { useContext, useEffect } from "react";
import dataContext from "../utils/contextApi";
import Cookies from "js-cookie";
import Account from "./Account";
import { getCourses } from "../utils/data/CoursesData";
import { getUsers, getAccount } from "../utils/data/UsersData";
import { useToast } from "@chakra-ui/react";

const Routers = () => {
  const {
    isLogin,
    setIsLogin,
    setCourses,
    setUsers,
    setAccount,
    setErrors,
    errors,
    setCategories,
  } = useContext(dataContext);

  const location = useLocation();

  useEffect(() => {
    setIsLogin(Cookies.get("isLoggedIn") ? true : false);

    getCourses().then((data) => {
      const uniqueCategories = [];
      const slugSet = new Set();

      data.forEach((course) => {
        if (!slugSet.has(course.categorySlug)) {
          slugSet.add(course.categorySlug);
          uniqueCategories.push({
            title: course.categoryTitle,
            slug: course.categorySlug,
          });
        }
      });

      setCourses(data);
      setCategories(uniqueCategories);
    });

    getUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        setErrors([...errors, error]);
      });

    if (Cookies.get("isLoggedIn")) {
      getAccount()
        .then((data) => {
          if (Cookies.get("isLoggedIn")) {
            setAccount(data);
          }
        })
        .catch((error) => {
          setErrors([...errors, error]);
        });
    }
  }, [location.pathname]);

  const toast = useToast();

  useEffect(() => {
    if (errors && errors.length > 0) {
      // Tüm hataları birleştir
      const errorMessage = errors.map((error) => error.message).join(", ");

      // Tek bir toast çağrısıyla tüm hataları göster
      toast({
        title: "Errors",
        description: `Errors: ${errorMessage}`,
        errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      // Hataları temizle
      setErrors([]);
    }
  }, [errors]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:slug" element={<Course />} />
        <Route path="/all-courses" element={<AllCourses />} />
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
        <Route
          path="/dashboard"
          element={isLogin ? <Dashboard /> : <Navigate to="/" replace />}
        ></Route>
      </Routes>
    </>
  );
};

export default Routers;
