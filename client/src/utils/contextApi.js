import { createContext, useState } from "react";

const dataContext = createContext();

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  return (
    <dataContext.Provider
      value={{
        courses,
        setCourses,
        users,
        setUsers,
      }}
    >
      {children}
    </dataContext.Provider>
  );
};

export default dataContext;
