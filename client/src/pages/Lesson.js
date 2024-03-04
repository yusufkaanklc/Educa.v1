import {
  Box,
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import dataContext from "../utils/contextApi";
import { getLessons } from "../utils/data/LessonsData";
import { getCourse } from "../utils/data/CoursesData";
const Lesson = () => {
  const {
    isMobile,
    isLaptop,
    setTargetScroll,
    setErrors,
    errors,
    course,
    setCourse,
  } = useContext(dataContext);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState({});

  const { page, courseSlug, lessonSlug } = useParams();
  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };
  const navigate = useNavigate();
  const handleClick = (link) => {
    setTargetScroll(link);
    navigate("/");
  };

  useEffect(() => {
    getCourse(courseSlug)
      .then((data) => setCourse(data))
      .catch((error) => setErrors([...errors, error]));
    getLessons(courseSlug)
      .then((data) => setLessons(data))
      .catch((error) => setErrors([...errors, error]));
  }, []);

  useEffect(() => {
    const currentLesson = lessons.filter((el) => el.slug === lessonSlug)[0];
    setLesson(currentLesson);
  }, [lessons]);

  return (
    <Box
      bgColor={"white"}
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      p={responsive("", "1em ", "2em")}
      mx={responsive("", "8em", "10em")}
      my={responsive("", "2em", "3em")}
    >
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to="/"
            onClick={() => setTargetScroll("")}
            fontWeight={500}
            opacity={0.9}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {page === "courses" ? (
          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              onClick={() => handleClick("courses")}
            >
              Courses
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : page === "all-courses" ? (
          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              as={Link}
              to={"/all-courses"}
            >
              All courses
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink
              fontWeight={500}
              opacity={0.9}
              as={Link}
              to={"/dashboard"}
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink
            fontWeight={500}
            opacity={0.9}
            as={Link}
            to={`/${page}/course/${courseSlug}`}
          >
            {course.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            fontWeight={500}
            opacity={0.9}
            as={Link}
            to={`/${page}/course/${courseSlug}/lessons/${lessonSlug}`}
          >
            {lesson && lesson.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};

export default Lesson;
