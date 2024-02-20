import { createContext, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState([]);
  const [teachers, setTeachers] = useState([]);

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
