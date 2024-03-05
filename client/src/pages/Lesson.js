import {
  Box,
  Grid,
  GridItem,
  Breadcrumb,
  Flex,
  BreadcrumbItem,
  Text,
  Heading,
  Center,
  Button,
  Stack,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import ReactPlayer from "react-player";
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
  const [lessonPoint, setLessonPoint] = useState(null);
  const [starList, setStarList] = useState([]);

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
    setLessonPoint(currentLesson && currentLesson.point);
  }, [lessons]);

  useEffect(() => {
    let starLisst = [];
    for (let i = 0; i < lessonPoint; i++) {
      starLisst.push(i);
    }
    setStarList(starLisst);
  }, [lessonPoint]);

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
      <Grid
        mt={responsive("", "2em", "3em")}
        templateRows="repeat(auto-fill, minmax(1em, auto))"
        templateColumns={responsive("1fr", "repeat(4, 1fr)", "repeat(4, 1fr)")}
        gap={10}
      >
        <GridItem
          colSpan={1}
          rowSpan={17}
          display={"flex"}
          flexDir={"column"}
          gap={"1em"}
          maxW={"22em"}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          <Heading fontSize={responsive("", "md", "lg")} fontWeight={"600"}>
            Lessons
          </Heading>
          {lessons &&
            lessons.map((lesson, index) => (
              <Flex
                opacity={lesson.slug === lessonSlug ? 1 : 0.9}
                _hover={{ border: "2px dashed #cfcfcf", opacity: "1" }}
                border={
                  lesson.slug === lessonSlug
                    ? "2px dashed #cfcfcf"
                    : "2px dashed transparent"
                }
                key={index}
                align={"center"}
                justify={"space-between"}
                bgColor={"white"}
                borderRadius={"7px"}
                p={".5em"}
              >
                <Flex gap={".5em"} align={"center"}>
                  <Box
                    w={".5em"}
                    h={".5em"}
                    borderRadius={".5em"}
                    bgColor={"var(--accent-color)"}
                  ></Box>
                  <Text
                    fontWeight={500}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                    fontSize={responsive("", "sm", "md")}
                  >
                    {lesson.title}
                  </Text>
                </Flex>
              </Flex>
            ))}
        </GridItem>
        <GridItem
          colSpan={3}
          rowSpan={7}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
            <Flex flexDir={"column"} gap={"1em"}>
              <Heading
                fontSize={responsive("", "2xl", "3xl")}
                fontWeight={600}
                color={"var(--secondary-color)"}
              >
                {lesson?.title}
              </Heading>
              <Text>{lesson?.description}</Text>
            </Flex>
            <Flex
              align={"center"}
              gap={".5em"}
              fontSize={responsive("", "sm", "md")}
            >
              <Box color={"var(--accent-color)"}>
                {starList.length > 0 &&
                  starList.map((star) => (
                    <StarIcon
                      key={star}
                      style={{ position: "relative", bottom: "3px" }}
                    ></StarIcon>
                  ))}
              </Box>
              <Text>({lesson?.comments && lesson.comments.length})</Text>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem
          colSpan={3}
          rowSpan={10}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          <Center h={"100%"} borderRadius={"10px"} overflow={"hidden"}>
            {lesson && lesson.videoUrl && (
              <ReactPlayer
                controls
                width={"100%"}
                height={"100%"}
                url={"http://localhost:5000/" + lesson.videoUrl}
              ></ReactPlayer>
            )}
          </Center>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Lesson;
