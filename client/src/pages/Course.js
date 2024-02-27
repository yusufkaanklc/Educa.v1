import React, { useEffect, useContext, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Avatar,
  Center,
  Stack,
  Grid,
  Link as ChakraLink,
  GridItem,
  Progress,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import dataContext from "../utils/contextApi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourse } from "../utils/data/CoursesData";
import { getLessons } from "../utils/data/LessonsData";
import { useToast } from "@chakra-ui/react";

const Course = () => {
  const { course, setCourse, isMobile, isLaptop, setTargetScroll, account } =
    useContext(dataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [starList, setStarList] = useState([]);
  const [enroll, setEnroll] = useState(null);
  const [lessons, setLessons] = useState([]);

  const { slug, page } = useParams();
  const toast = useToast();

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
  const handleLessonClick = () => {
    if (!account) {
      toast({
        title: "Error",
        description: "Please Login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (course.ownerName !== account.username && !enroll) {
      toast({
        title: "Error",
        description: "Please enroll",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // Buraya başka bir işlem eklenebilir veya boş bırakılabilir
    }
  };

  useEffect(() => {
    setIsLoading(true);

    getCourse(slug)
      .then((data) => {
        setCourse(data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

    getLessons(slug)
      .then((data) => {
        setLessons(data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const newStarList = [];
    for (let i = 1; i <= course.point; i++) {
      newStarList.push(i);
    }
    setStarList(newStarList);
  }, [course]);

  useEffect(() => {
    if (course && lessons.length > 0) {
      setIsLoading(false);
    }
  }, [course, lessons]);

  useEffect(() => {
    if (course && course.enrollments && account && account._id) {
      course.enrollments.forEach((enrollment) => {
        if (enrollment._id === account._id) {
          setEnroll(account._id);
        }
      });
    }
  }, [account, course]);

  return (
    <Box
      bgColor={"white"}
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      p={responsive("", "1em ", "2em")}
      mx={responsive("", "8em", "10em")}
      my={responsive("", "2em", "3em")}
    >
      <Flex
        mb={responsive("", "2em", "3em")}
        justifyContent={"space-between"}
        align={"center"}
      >
        {isLoading ? (
          <Skeleton
            h={responsive("", "1em", "1.5em")}
            w={responsive("", "10em", "15em")}
            borderRadius={"10px"}
          />
        ) : (
          <>
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
                  to={`/course/${slug}`}
                >
                  {course.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </>
        )}
        {isLoading ? (
          <Skeleton
            h={responsive("", "1em", "1.5em")}
            w={responsive("", "20em", "30em")}
            borderRadius={"10px"}
          />
        ) : (
          <Flex
            flexDir={"column"}
            align={"flex-end"}
            gap={responsive("", ".75em", "1em")}
          >
            <Flex align={"center"} gap={responsive("", "1em", "2em")}>
              <Heading
                fontSize={responsive("", "xl", "2xl")}
                fontWeight={600}
                opacity={0.9}
              >
                progress
              </Heading>
              <Progress
                value={course.lessonProgressRatio * 100}
                colorScheme="orange"
                w={responsive("", "15em", "20em")}
                borderRadius={"10px"}
                size={responsive("", "md", "lg")}
                bgColor={"var(--bg-color)"}
              />
              <Text>{course.lessonProgressRatio * 100 + "%"}</Text>
            </Flex>
          </Flex>
        )}
      </Flex>
      {isLoading ? (
        <Grid
          templateRows="repeat(auto-fill, minmax(1em, auto))"
          templateColumns={responsive(
            "1fr",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)"
          )}
          gap={10}
        >
          <GridItem
            borderRadius={"10px"}
            rowSpan={7}
            colSpan={1}
            overflow={"hidden"}
          >
            <Skeleton h={"100%"}></Skeleton>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={7}
            colSpan={1}
            overflow={"hidden"}
          >
            <Skeleton h={"100%"}></Skeleton>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={2}
            colSpan={1}
            overflow={"hidden"}
          >
            <Skeleton h={"100%"}></Skeleton>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={19}
            colSpan={1}
            overflow={"hidden"}
          >
            <Skeleton h={"100%"}></Skeleton>
          </GridItem>
        </Grid>
      ) : (
        <Grid
          templateRows="repeat(auto-fill, minmax(1em, auto))"
          templateColumns={responsive(
            "1fr",
            "repeat(2, 1fr)",
            "repeat(2, 1fr)"
          )}
          gap={10}
        >
          <GridItem
            borderRadius={"10px"}
            rowSpan={7}
            border={"2px dashed var(--secondary-color)"}
            colSpan={1}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            bgColor={"var(--bg-color)"}
            p={responsive("", "1em", "2em 1em")}
          >
            <Stack gap={responsive("", ".75em", "1em")}>
              <Heading
                fontSize={responsive("", "xl", "2xl")}
                fontWeight={"600"}
              >
                {course.title}
              </Heading>
              <Flex gap={".5em"}>
                <Text opacity={0.9}>{course.point ? course.point : 0}</Text>
                {starList.length > 0 ? (
                  starList.map((star) => (
                    <StarIcon
                      key={star}
                      color={"var(--accent-color)"}
                      pos={"relative"}
                      top={"2.5px"}
                    ></StarIcon>
                  ))
                ) : (
                  <i
                    class="fi fi-rr-star"
                    style={{ position: "relative", top: "2px" }}
                  ></i>
                )}
              </Flex>
              <Text fontSize={responsive("", "sm", "md")}>
                {course.description}
              </Text>
            </Stack>
            <Flex justify={"flex-end"}>
              <Button
                mt={"1em"}
                border={"1px solid transparent"}
                bgColor={"var(--accent-color)"}
                fontSize={responsive("", "sm", "md")}
                color={"white"}
                _hover={{
                  bgColor: "var(--bg-color)",
                  color: "orange",
                  border: "1px solid var(--accent-color)",
                }}
              >
                {account
                  ? course.ownerName === account.username
                    ? "Edit"
                    : enroll
                    ? "Continue"
                    : "Enroll now"
                  : "Login to enroll"}
              </Button>
            </Flex>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={6}
            colSpan={1}
            bgColor={"var(--bg-color)"}
            p={responsive("", "1em", "2em 1em")}
          >
            <Flex
              align={"center"}
              justify={"space-between"}
              mb={responsive("", "1em", "1em")}
            >
              <Box>
                <Flex gap={".5em"} align={"center"} fontWeight={600} mb={"1em"}>
                  <i
                    class="fi fi-rr-chalkboard-user"
                    style={{
                      position: "relative",
                      top: "2px",
                    }}
                  ></i>
                  <Text>Instructor</Text>
                </Flex>
                <Center
                  p={responsive("", "2px 5px", "3px 7px", "5px 10px")}
                  mb={".5em"}
                  border={"1px solid var(--secondary-color)"}
                  borderRadius={"5px"}
                  color={"var(--secondary-color)"}
                  w={"max-content"}
                >
                  {course.ownerName}
                </Center>
              </Box>
              <Avatar
                border={"2px dashed var(--secondary-color)"}
                src={"http://localhost:5000/" + course.ownerImage}
                bgColor={"var(--secondary-color)"}
                name={course.ownerName}
                size={responsive("", "xl", "xl")}
              ></Avatar>
            </Flex>

            <Text fontSize={responsive("", "xs", "sm")}>
              {course.ownerIntroduce}
            </Text>
          </GridItem>

          <GridItem
            borderRadius={"10px"}
            rowSpan={19}
            colSpan={1}
            bgColor={"var(--bg-color)"}
            p={responsive("", "1em", "2em 1em")}
          >
            <Flex align={"center"} gap={".5em"}>
              <i
                class="fi fi-rr-book-alt"
                style={{ position: "relative", top: "2px", fontSize: "1.5em" }}
              ></i>
              <Heading fontSize={responsive("", "xl", "2xl")} fontWeight={600}>
                Lessons
              </Heading>
            </Flex>
            <Flex
              flexDir={"column"}
              gap={responsive("", "1em", "2em")}
              mt={responsive("", "1em", "2em")}
              px={responsive("", "1em", "2em")}
            >
              {lessons &&
                lessons.map((lesson, index) => (
                  <Flex key={index} align={"center"} justify={"space-between"}>
                    <Flex
                      gap={".5em"}
                      align={"center"}
                      fontSize={responsive("", "sm", "md")}
                    >
                      <Box
                        w={"1em"}
                        h={"1em"}
                        borderRadius={"full"}
                        bgColor={"var(--accent-color)"}
                      ></Box>
                      <ChakraLink
                        as={Link}
                        onClick={() => handleLessonClick()}
                        to={
                          enroll ||
                          (account && account.username === course.ownerName)
                            ? `/lesson/${lesson.slug}`
                            : ""
                        }
                        fontWeight={500}
                        opacity={0.9}
                      >
                        {lesson.title}
                      </ChakraLink>
                    </Flex>
                    <Text
                      opacity={0.9}
                      fontWeight={500}
                      fontSize={responsive("", "sm", "md")}
                    >
                      {lesson.duration ? lesson.duration + "min" : "140 min"}
                    </Text>
                  </Flex>
                ))}
            </Flex>
          </GridItem>
          <GridItem
            border={"2px dashed transparent"}
            borderRadius={"10px"}
            rowSpan={3}
            colSpan={1}
            bgColor={"var(--secondary-color)"}
            color={"white"}
            px={responsive("", "1em", "1em")}
            transition={"0.3s ease"}
            _hover={{
              bgColor: "white",
              color: "var(--secondary-color)",
              border: "2px dashed var(--secondary-color)",
            }}
          >
            <Flex align={"center"} justify={"space-between"} h={"100%"}>
              <Flex gap={".5em"} align={"center"} fontWeight={600}>
                <i
                  class="fi fi-rr-book-alt"
                  style={{
                    position: "relative",
                    top: "2px",
                  }}
                ></i>
                <Text fontSize={responsive("", "sm", "md")}>
                  Course Details
                </Text>
              </Flex>
              <Flex align={"center"} gap={".5em"}>
                <Flex
                  gap={".5em"}
                  align={"center"}
                  fontWeight={500}
                  opacity={0.9}
                >
                  <i
                    class="fi fi-rr-users-alt"
                    style={{
                      position: "relative",
                      top: "2px",
                    }}
                  ></i>
                  <Text fontSize={responsive("", "sm", "md")}>
                    {course.enrollments && course.enrollments.length}{" "}
                    Enrollments
                  </Text>
                </Flex>
                /
                <Flex
                  gap={".5em"}
                  align={"center"}
                  fontWeight={500}
                  opacity={0.9}
                >
                  <i
                    class="fi fi-rr-clock-three"
                    style={{
                      position: "relative",
                      top: "2px",
                    }}
                  ></i>
                  <Text fontSize={responsive("", "sm", "md")}>45 Hours</Text>
                </Flex>
                /
                <Flex
                  gap={".5em"}
                  align={"center"}
                  fontWeight={500}
                  opacity={0.9}
                >
                  <i
                    class="fi fi-rr-book-alt"
                    style={{
                      position: "relative",
                      top: "2px",
                    }}
                  ></i>
                  <Text fontSize={responsive("", "sm", "md")}>
                    {course.lessons && course.lessons.length} Lessons
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default Course;
