import { createContext, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import Cookies from "js-cookie";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const apiUrl = "http://educa.ykaan.com.tr/";
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [isLogin, setIsLogin] = useState(
    Cookies.get("isLoggedIn") ? true : false
  );
  const [userRole, setUserRole] = useState(Cookies.get("role"));
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseCreateData, setCourseCreateData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    price: "",
  });
  const [lessonCreateData, setLessonCreateData] = useState({
    title: "",
    description: "",
    video: "",
    notes: "",
  });
  const [courseUpdateData, setCourseUpdateData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [targetScroll, setTargetScroll] = useState("");
  const [createdLessonsList, setCreatedLessonsList] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isLaptop] = useMediaQuery("(max-width: 1568px)");
  const [isDesktop] = useMediaQuery("(max-width: 1920px)");

  return (
    <dataContext.Provider
      value={{
        apiUrl,
        courses,
        setCourses,
        users,
        setUsers,
        teachers,
        searchQuery,
        setSearchQuery,
        setTeachers,
        lessonCreateData,
        setLessonCreateData,
        account,
        setAccount,
        categories,
        setCategories,
        targetScroll,
        courseCreateData,
        setCourseCreateData,
        setCreatedLessonsList,
        createdLessonsList,
        setTargetScroll,
        isLogin,
        setIsLogin,
        userRole,
        setUserRole,
        courseUpdateData,
        setCourseUpdateData,
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
