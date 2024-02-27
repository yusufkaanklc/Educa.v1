import { createContext, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import Cookies from "js-cookie";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [course, setCourse] = useState({});
  const [isLogin, setIsLogin] = useState(
    Cookies.get("isLoggedIn") ? true : false
  );
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [targetScroll, setTargetScroll] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isLaptop] = useMediaQuery("(max-width: 1568px)");
  const [isDesktop] = useMediaQuery("(max-width: 1920px)");

  return (
    <dataContext.Provider
      value={{
        courses,
        setCourses,
        users,
        setUsers,
        teachers,
        setTeachers,
        account,
        setAccount,
        course,
        setCourse,
        categories,
        setCategories,
        targetScroll,
        setTargetScroll,
        isLogin,
        setIsLogin,
        errors,
        setErrors,
        isMobile,
        isLaptop,
        isDesktop,
      }}
    >
      {children}
    </dataContext.Provider>
  );
};

export default dataContext;
