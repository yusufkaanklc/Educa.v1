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
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import ReactPlayer from "react-player";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import dataContext from "../utils/contextApi";
import { getLessons, updateLessonState } from "../utils/data/LessonsData";
import { getCourse, getCourseState } from "../utils/data/CoursesData";
const Lesson = () => {
  const {
    isMobile,
    isLaptop,
    setTargetScroll,
    setErrors,
    errors,
    course,
    account,
    setCourse,
    courseStates,
    setCourseStates,
  } = useContext(dataContext);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState({});
  const [lessonPoint, setLessonPoint] = useState(null);
  const [starList, setStarList] = useState([]);
  const [currentVideoTime, setCurrentVideoTime] = useState(null);
  const [isLessonFinished, setIsLessonFinished] = useState(false);

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

  const navigateLesson = (lessonSlug) => {
    navigate(`/${page}/course/${courseSlug}/lessons/${lessonSlug}`);
  };

  const toast = useToast();

  const updateLessonStateFunc = (lessonSlug) => {
    if (isLessonFinished) {
      updateLessonState(courseSlug, lessonSlug, "lesson")
        .then(() => {
          toast({
            title: "Success",
            description: "The course was completed successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate(`/${page}/course/${courseSlug}`);
        })
        .catch((error) => {
          setErrors([...errors, error]);
        });
    } else {
      toast({
        title: "Warning",
        description: "Please complete the course",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getCourse(courseSlug)
      .then((data) => setCourse(data))
      .catch((error) => setErrors([...errors, error]));
    getLessons(courseSlug)
      .then((data) => setLessons(data))
      .catch((error) => setErrors([...errors, error]));
  }, [courseSlug]);

  useEffect(() => {
    const currentLesson = lessons.filter((el) => el.slug === lessonSlug)[0];
    setLesson(currentLesson);
    setLessonPoint(currentLesson && currentLesson.point);
  }, [lessons, lessonSlug]);

  useEffect(() => {
    let starLisst = [];
    for (let i = 0; i < lessonPoint; i++) {
      starLisst.push(i);
    }
    setStarList(starLisst);
  }, [lessonPoint]);

  useEffect(() => {
    if ((currentVideoTime / lesson?.duration) * 100 >= 80) {
      setIsLessonFinished(true);
    }
  }, [currentVideoTime]);

  useEffect(() => {
    getCourseState(courseSlug).then((data) => setCourseStates(data));
  }, [courseSlug, isLessonFinished]);

  useEffect(() => {
    if (courseStates) {
      const lessonState = courseStates.lessonsStates.find(
        (el) => el.lesson === lesson?._id
      );
      setIsLessonFinished(lessonState?.state);
    }
  }, [courseStates, lesson]);

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
          gap={"1.5em"}
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
                onClick={() => navigateLesson(lesson.slug)}
                cursor={"pointer"}
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
                <Text
                  fontWeight={500}
                  opacity={0.9}
                  fontSize={responsive("", "sm", "md")}
                >
                  {lesson.duration
                    ? lesson.duration < 60
                      ? lesson.duration + " sec"
                      : Math.floor(lesson.duration / 60) +
                        " min " +
                        (lesson.duration % 60) +
                        " sec"
                    : "0 min"}
                </Text>
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
                {starList.length > 0 ? (
                  starList.map((star) => (
                    <StarIcon
                      key={star}
                      style={{ position: "relative", bottom: "3px" }}
                    ></StarIcon>
                  ))
                ) : (
                  <i
                    class="fi fi-rr-star"
                    style={{ position: "relative", top: "2px" }}
                  ></i>
                )}
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
                onProgress={(state) =>
                  setCurrentVideoTime(state.playedSeconds.toFixed(0))
                }
                controls
                width={"100%"}
                height={"100%"}
                url={"http://localhost:5000/" + lesson.videoUrl}
              ></ReactPlayer>
            )}
          </Center>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={7}
          p={"1em"}
          borderRadius={"10px"}
        ></GridItem>
        <GridItem
          colSpan={3}
          rowSpan={7}
          maxH={responsive("", "60em", "62em")}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
            <Stack>
              <Heading fontSize={responsive("", "md", "lg")} fontWeight={"600"}>
                Course Note
              </Heading>
              <Text fontWeight={500} fontSize={responsive("", "sm", "md")}>
                {lesson?.notes}
              </Text>
            </Stack>
            <Flex justify={"flex-end"}>
              {account?.username !== course?.ownerName && (
                <Button
                  variant={"outline"}
                  bgColor={"var(--accent-color)"}
                  color={"white"}
                  isDisabled={isLessonFinished}
                  onClick={() => updateLessonStateFunc(lesson.slug)}
                  fontSize={responsive("", "sm", "md")}
                  border={"1px solid var(--accent-color)"}
                  _hover={{
                    bgColor: "white",
                    color: "var(--accent-color)",
                  }}
                >
                  Finish
                </Button>
              )}
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={1} rowSpan={17}></GridItem>
        <GridItem
          colSpan={3}
          rowSpan={17}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        ></GridItem>
      </Grid>
    </Box>
  );
};

export default Lesson;
