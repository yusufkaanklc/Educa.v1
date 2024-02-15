import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CoursesPage from "./CoursesPage.js";
const HomePage = () => {
  const [courses, setCourses] = useState();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/courses/");
        setCourses(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <>
      <BrowserRouter>
        <div>Kurslar</div>
        {courses &&
          courses.map((course) => (
            <Link to={`/courses/${course.slug}`} key={course._id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  width={"50px"}
                  src={"http://localhost:5000/" + course.imageUrl}
                  alt=""
                />
                <div>{course.title}</div>
              </div>
            </Link>
          ))}

        <Routes>
          <Route path="/courses/:courseSlug" element={<CoursesPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default HomePage;
