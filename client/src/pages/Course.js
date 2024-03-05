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
  Tooltip,
  Grid,
  Link as ChakraLink,
  ButtonGroup,
  Image,
  GridItem,
  Progress,
  FormLabel,
  Skeleton,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import dataContext from "../utils/contextApi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourse, updateCourse } from "../utils/data/CoursesData";
import { enrollCourse, getAccount } from "../utils/data/UsersData";
import { deleteLesson, getLessons } from "../utils/data/LessonsData";
import { useToast } from "@chakra-ui/react";

const Course = () => {
  const {
    course,
    setCourse,
    isMobile,
    isLaptop,
    setTargetScroll,
    account,
    courseUpdateData,
    setCourseUpdateData,
    errors,
    setErrors,
  } = useContext(dataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [starList, setStarList] = useState([]);
  const [enroll, setEnroll] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [filteredLessonList, setFilteredLessonList] = useState([]);
  const [deletedLessonList, setDeletedLessonList] = useState([]);
  const [isCourseEditing, setIsCourseEditing] = useState(false);
  const [isLessonsEditing, setIsLessonsEditing] = useState(false);

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

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseUpdateData({ ...courseUpdateData, [name]: value });
  };

  const handleCourseChangeImage = (e) => {
    const { name, files } = e.target;
    setCourseUpdateData({ ...courseUpdateData, [name]: files[0] });
    if (e.target.files.length > 0) {
      toast({
        title: "Success",
        description: "Image uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCourseUpdateSubmit = () => {
    const courseUpdateFormData = new FormData();
    courseUpdateFormData.append("title", courseUpdateData.title);
    courseUpdateFormData.append("description", courseUpdateData.description);
    courseUpdateFormData.append("price", courseUpdateData.price);
    courseUpdateFormData.append("image", courseUpdateData.image);
    updateCourse(slug, courseUpdateFormData)
      .then(() => {
        toast({
          title: "Success",
          description: "Course updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsCourseEditing(false);
        handleClick("courses");
      })
      .catch((error) => setErrors([...errors, error]));
  };

  const handleDeleteLesson = (lessonTitle) => {
    const updatedLessons = filteredLessonList.filter(
      (lesson) => lesson.title !== lessonTitle
    );
    const deletedLesson = lessons.find(
      (lesson) => lesson.title === lessonTitle
    );
    setFilteredLessonList(updatedLessons);
    setDeletedLessonList((prevDeletedList) => [
      ...prevDeletedList,
      deletedLesson,
    ]);
  };

  const handleLessonDeleteSubmit = async () => {
    try {
      if (deletedLessonList.length > 0) {
        const deletionPromises = deletedLessonList.map(async (lesson) => {
          await deleteLesson(slug, lesson.slug);
        });
        await Promise.all(deletionPromises);
        toast({
          title: "Success",
          description: "Lessons Deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsLessonsEditing(false);
        // Sildikten sonra filteredLessonList'i güncelle
        setFilteredLessonList((prevLessons) =>
          prevLessons.filter(
            (lesson) =>
              !deletedLessonList.some(
                (deleted) => deleted.title === lesson.title
              )
          )
        );
        // deletedLessonList'i boşalt
        setDeletedLessonList([]);
      } else {
        setIsLessonsEditing(false);
      }
    } catch (error) {
      setErrors([...errors, error]);
    }
  };

  const refreshLessons = () => {
    getLessons(slug)
      .then((data) => {
        setLessons(data);
      })
      .catch((error) => {
        setErrors([...errors, error]);
      });
  };

  const handleEnrollCourse = async () => {
    try {
      await enrollCourse(slug);
      toast({
        title: "Success",
        description: "enrolled in the course",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      const courseData = await getCourse(slug);
      setCourse(courseData);
    } catch (error) {
      setErrors([...errors, error]);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getCourse(slug)
      .then((data) => {
        setCourse(data);
      })
      .catch((error) => {
        setErrors([...errors, error]);
      });

    getLessons(slug)
      .then((data) => {
        setLessons(data);
      })
      .catch((error) => {
        setErrors([...errors, error]);
      });

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const newStarList = [];
    for (let i = 1; i <= course.point; i++) {
      newStarList.push(i);
    }
    setStarList(newStarList);
    setCourseUpdateData({
      title: course.title,
      description: course.description,
      price: course.price,
      image: course.imageUrl,
    });
  }, [course]);

  useEffect(() => {
    if (course) {
      setIsLoading(false);
    }
  }, [course]);

  useEffect(() => {
    setFilteredLessonList(lessons);
  }, [lessons]);

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
                  to={`/courses/course/${slug}`}
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
          enroll && (
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
          )
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
              <FormControl pos={"relative"}>
                {course.imageUrl !== "" && course.imageUrl ? (
                  <Image
                    src={"http://localhost:5000/" + course.imageUrl}
                    borderRadius={"10px"}
                    pos={"relative"}
                    top={0}
                    left={0}
                  ></Image>
                ) : (
                  <Skeleton
                    h={responsive("", "1em", "10em")}
                    w={responsive("", "10em", "15em")}
                    borderRadius={"10px"}
                  />
                )}
                <FormLabel
                  htmlFor="image"
                  pos={"absolute"}
                  top={"0"}
                  left={0}
                  w={"100%"}
                  h={"100%"}
                  opacity={0.5}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  cursor={"pointer"}
                >
                  {isCourseEditing && (
                    <i
                      class="fi fi-rr-camera"
                      style={{
                        position: "relative",
                        top: "2px",
                        fontSize: responsive("", "8em", "10em"),
                      }}
                    ></i>
                  )}
                </FormLabel>
                <Input
                  type="file"
                  onChange={(e) => handleCourseChangeImage(e)}
                  accept="image/*"
                  name="image"
                  display={"none"}
                  id="image"
                ></Input>
              </FormControl>
              {isCourseEditing ? (
                <FormControl>
                  <Input
                    autoFocus
                    type={"text"}
                    name="title"
                    variant={"flushed"}
                    fontWeight={"600"}
                    value={courseUpdateData.title}
                    fontFamily={"Montserrat, sans-serif;"}
                    fontSize={responsive("", "xl", "2xl")}
                    onChange={(e) => handleCourseChange(e)}
                    _focus={{
                      borderColor: "#cdcdcd",
                      outline: 0,
                      boxShadow: "none",
                    }}
                  />
                </FormControl>
              ) : (
                <Heading
                  fontSize={responsive("", "xl", "2xl")}
                  fontWeight={"600"}
                >
                  {course.title}
                </Heading>
              )}

              {isCourseEditing ? (
                <FormControl>
                  <Input
                    type={"text"}
                    name="description"
                    value={courseUpdateData.description}
                    variant={"flushed"}
                    fontSize={responsive("", "sm", "md")}
                    onChange={(e) => handleCourseChange(e)}
                    _focus={{
                      borderColor: "#cdcdcd",
                      outline: 0,
                      boxShadow: "none",
                    }}
                  />
                </FormControl>
              ) : (
                <Text fontSize={responsive("", "sm", "md")}>
                  {course.description}
                </Text>
              )}
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
            </Stack>
            <Flex align={"center"} justify={"space-between"}>
              {isCourseEditing ? (
                <FormControl>
                  <Input
                    type={"text"}
                    name="price"
                    variant={"flushed"}
                    fontWeight={"600"}
                    value={courseUpdateData.price}
                    fontFamily={"Montserrat, sans-serif;"}
                    opacity={"0.9"}
                    fontSize={responsive("", "sm", "md")}
                    onChange={(e) => handleCourseChange(e)}
                    _focus={{
                      borderColor: "#cdcdcd",
                      outline: 0,
                      boxShadow: "none",
                    }}
                  />
                </FormControl>
              ) : (
                <Text
                  fontSize={responsive("", "sm", "md")}
                  fontWeight={"500"}
                  opacity={"0.9"}
                >
                  {course.price}$
                </Text>
              )}
              <ButtonGroup>
                {isCourseEditing && (
                  <Button
                    border={"1px solid transparent"}
                    bgColor={"var(--secondary-color)"}
                    fontSize={responsive("", "sm", "md")}
                    onClick={() => handleCourseUpdateSubmit()}
                    color={"white"}
                    _hover={{
                      bgColor: "var(--bg-color)",
                      color: "var(--secondary-color)",
                      border: "1px solid var(--secondary-color)",
                    }}
                  >
                    Save
                  </Button>
                )}
                <Button
                  border={"1px solid transparent"}
                  bgColor={"var(--accent-color)"}
                  fontSize={responsive("", "sm", "md")}
                  onClick={() => {
                    if (account && course.ownerName === account.username) {
                      setIsCourseEditing(!isCourseEditing);
                      if (isCourseEditing) {
                        setCourseUpdateData({
                          title: course.title,
                          description: course.description,
                          price: course.price,
                        });
                        setLessons();
                      }
                    } else if (
                      account &&
                      course.ownerName !== account.username &&
                      !enroll
                    ) {
                      handleEnrollCourse();
                    } else if (!account) {
                      navigate("/login");
                    }
                  }}
                  color={"white"}
                  _hover={{
                    bgColor: "var(--bg-color)",
                    color: "var(--accent-color)",
                    border: "1px solid var(--accent-color)",
                  }}
                >
                  {account
                    ? course.ownerName === account.username
                      ? isCourseEditing
                        ? "Reset"
                        : "Edit"
                      : enroll
                      ? "Continue"
                      : "Enroll now"
                    : "Login to enroll"}
                </Button>
              </ButtonGroup>
            </Flex>
          </GridItem>
          <GridItem
            borderRadius={"10px"}
            rowSpan={6}
            colSpan={1}
            border={"2px dashed var(--secondary-color)"}
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
              {course.ownerImage ? (
                <Center
                  border={"2px solid var(--secondary-color)"}
                  w={responsive("", "5.5em", "6.5em")}
                  h={responsive("", "5.5em", "6.5em")}
                  borderRadius={"full"}
                  overflow={"hidden"}
                >
                  <Image
                    transform={"scale(1.5)"}
                    src={"http://localhost:5000/" + course.ownerImage}
                    bgColor={"var(--secondary-color)"}
                    name={course.ownerName}
                  />
                </Center>
              ) : (
                <Avatar
                  border={"2px dashed var(--secondary-color)"}
                  bgColor={"var(--secondary-color)"}
                  name={course.ownerName}
                  size={responsive("", "xl", "xl")}
                ></Avatar>
              )}
            </Flex>

            <Text fontSize={responsive("", "sm", "md")}>
              {course.ownerIntroduce}
            </Text>
          </GridItem>

          <GridItem
            borderRadius={"10px"}
            rowSpan={19}
            border={"2px dashed var(--secondary-color)"}
            colSpan={1}
            bgColor={"var(--bg-color)"}
            p={responsive("", "1em", "2em 1em")}
          >
            <Flex align={"center"} justify={"space-between"}>
              <Flex align={"center"} gap={".5em"}>
                <i
                  class="fi fi-rr-book-alt"
                  style={{
                    position: "relative",
                    top: "2px",
                    fontSize: "1.5em",
                  }}
                ></i>
                <Heading
                  fontSize={responsive("", "xl", "2xl")}
                  fontWeight={600}
                >
                  Lessons
                </Heading>
              </Flex>
              <ButtonGroup>
                {isLessonsEditing && (
                  <Button
                    border={"1px solid transparent"}
                    bgColor={"var(--secondary-color)"}
                    fontSize={responsive("", "sm", "md")}
                    onClick={() => handleLessonDeleteSubmit()}
                    color={"white"}
                    _hover={{
                      bgColor: "var(--bg-color)",
                      color: "var(--secondary-color)",
                      border: "1px solid var(--secondary-color)",
                    }}
                  >
                    Save
                  </Button>
                )}

                {account?.username === course?.ownerName && (
                  <Button
                    border={"1px solid transparent"}
                    bgColor={"var(--accent-color)"}
                    fontSize={responsive("", "sm", "md")}
                    onClick={() => {
                      account &&
                        course.ownerName === account.username &&
                        setIsLessonsEditing(!isLessonsEditing);
                      if (isLessonsEditing) {
                        setCourseUpdateData({
                          title: course.title,
                          description: course.description,
                          price: course.price,
                        });
                      }

                      refreshLessons();
                      setDeletedLessonList([]);
                    }}
                    color={"white"}
                    _hover={{
                      bgColor: "var(--bg-color)",
                      color: "orange",
                      border: "1px solid var(--accent-color)",
                    }}
                  >
                    {isLessonsEditing ? "Reset" : "Edit"}
                  </Button>
                )}
              </ButtonGroup>
            </Flex>
            <Flex
              flexDir={"column"}
              gap={responsive("", "1em", "2em")}
              mt={responsive("", "1em", "2em")}
            >
              {filteredLessonList.length > 0 &&
                filteredLessonList.map((lesson, index) => (
                  <Flex
                    key={index}
                    align={"center"}
                    justify={"space-between"}
                    w={"100%"}
                  >
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
                      <Tooltip label={lesson.title} aria-label="A tooltip">
                        <Text
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                          overflow={"hidden"}
                          fontWeight={500}
                          maxW={responsive("", "10em", "12em")}
                          fontSize={responsive("", "sm", "md")}
                          opacity={0.9}
                        >
                          {lesson.title}
                        </Text>
                      </Tooltip>
                    </Flex>
                    <Tooltip label={lesson.description} aria-label="A tooltip">
                      <Text
                        textOverflow={"ellipsis"}
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        fontWeight={500}
                        maxW={responsive("", "10em", "12em")}
                        fontSize={responsive("", "sm", "md")}
                        opacity={0.9}
                      >
                        {lesson.description}
                      </Text>
                    </Tooltip>

                    <Flex align={"center"} gap={"1em"}>
                      <Text
                        opacity={0.9}
                        fontWeight={500}
                        fontSize={responsive("", "sm", "md")}
                        w={"max-content"}
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
                      <ChakraLink
                        as={Link}
                        onClick={() => handleLessonClick()}
                        _hover={{ textDecor: "none" }}
                        to={
                          enroll ||
                          (account && account.username === course.ownerName)
                            ? `/${page}/course/${slug}/lessons/${lesson.slug}`
                            : ""
                        }
                      >
                        <Button
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
                          View
                        </Button>
                      </ChakraLink>

                      {isLessonsEditing && (
                        <Button
                          variant="outline"
                          p=".5em"
                          minH="max-content"
                          minW="max-content"
                          color={"white"}
                          onClick={() => handleDeleteLesson(lesson.title)}
                          fontSize={responsive("", "sm", "md")}
                          _hover={{
                            bgColor: "var(--bg-color)",
                            color: "var(--accent-color)",
                          }}
                          bgColor={"var(--accent-color)"}
                        >
                          <i
                            className="fi fi-rr-trash"
                            style={{ position: "relative", top: "2px" }}
                          />
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                ))}
              {isLessonsEditing && (
                <Button
                  border={"2px dashed transparent"}
                  borderRadius={"7px"}
                  bgColor={"var(--secondary-color)"}
                  color={"white"}
                  px={responsive("", "1em", "1em")}
                  fontSize={responsive("", "sm", "md")}
                  transition={"0.3s ease"}
                  _hover={{
                    bgColor: "var(--bg-color)",
                    color: "var(--secondary-color)",
                    border: "2px dashed var(--secondary-color)",
                  }}
                >
                  <ChakraLink
                    as={Link}
                    to={`/create-course?course=${slug}`}
                    w={"100%"}
                    h={"100%"}
                    display={"flex"}
                    _hover={{ textDecor: "none" }}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    Add lesson
                  </ChakraLink>
                </Button>
              )}
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
                    {course.enrollments && course.enrollments.length}
                    &nbsp;Enrollments
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
                  <Text fontSize={responsive("", "sm", "md")}>
                    {course.duration
                      ? course.duration < 60
                        ? course.duration + " sec"
                        : Math.floor(course.duration / 60) +
                          " min " +
                          (course.duration % 60) +
                          " sec"
                      : "0 min"}
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
