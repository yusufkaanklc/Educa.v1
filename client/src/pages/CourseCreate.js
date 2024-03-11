import { useContext, useEffect, useState } from "react";
import dataContext from "../utils/contextApi";
import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  FormControl,
  Textarea,
  List,
  ListItem,
  VStack,
  Input,
  FormLabel,
  Center,
  Button,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { createCourse, getCourse } from "../utils/data/CoursesData";
import { createLesson } from "../utils/data/LessonsData";
import { getCategories } from "../utils/data/CategoryData";
const CourseCreate = () => {
  const {
    isMobile,
    isLaptop,
    setTargetScroll,
    setCourseCreateData,
    courseCreateData,
    setErrors,
    setSearchQuery,
    searchQuery,
    errors,
    setLessonCreateData,
    lessonCreateData,
    createdLessonsList,
    setCreatedLessonsList,
  } = useContext(dataContext);

  const [categories, setCategories] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [course, setCourse] = useState(null);
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get("course");

  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  const handleChangeForCourse = (e) => {
    const { name, value } = e.target;
    setCourseCreateData({
      ...courseCreateData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleClick = (link) => {
    setTargetScroll(link);
    navigate("/");
  };

  const toast = useToast();

  const handleChangeForCourseImage = (e) => {
    const { name, files } = e.target;

    setCourseCreateData({ ...courseCreateData, [name]: files[0] });

    toast({
      title: "Success",
      description: "Your image has been uploaded!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleCreateCourseSubmit = () => {
    const courseFormData = new FormData();
    courseFormData.append("title", courseCreateData.title);
    courseFormData.append("description", courseCreateData.description);
    courseFormData.append("image", courseCreateData.image);
    courseFormData.append("price", courseCreateData.price);
    courseFormData.append("category", courseCreateData.category);

    const areFieldsEmptyCourse = Object.values(courseCreateData).some(
      (value) => value === ""
    );

    if (!areFieldsEmptyCourse && createdLessonsList.length > 0) {
      // Show loading toast
      const loadingToastId = toast({
        title: "Loading",
        description: "Creating course...",
        status: "info",
        duration: null, // Set duration to null to keep the toast until it's manually closed
        isClosable: false,
      });

      createCourse(courseFormData)
        .then((data) => {
          // Hide loading toast
          toast.close(loadingToastId);

          // Show success toast
          toast({
            title: "Success",
            description: "Course created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          handleLessonCreateSubmit(data.slug);
        })
        .catch((error) => {
          // Hide loading toast
          toast.close(loadingToastId);

          // Show error toast
          toast({
            title: "Error",
            description: "An error occurred while creating the course",
            status: "error",
            duration: 5000,
            isClosable: true,
          });

          setErrors([...errors, error]);
        });
    } else {
      toast({
        title: "Warning",
        description: "Course fields or lessons are empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSelect = (option) => {
    setShowOptions(false);
    setCourseCreateData({ ...courseCreateData, category: option._id });
    setSearchQuery(option.title);
  };

  const handleChangeForLesson = (e) => {
    const { name, value } = e.target;
    setLessonCreateData({ ...lessonCreateData, [name]: value });
  };

  const handleChangeForLessonVideo = async (e) => {
    const { name, files } = e.target;
    setLessonCreateData({ ...lessonCreateData, [name]: files[0] });
  };

  const handleLessonCreateSubmit = async (courseSlug) => {
    const loadingToastId = toast({
      title: "Loading",
      description: "Creating lessons...",
      status: "info",
      duration: null, // Set duration to null to keep the toast until it's manually closed
      isClosable: false,
    });
    try {
      if (createdLessonsList.length > 0) {
        for (const lesson of createdLessonsList) {
          const lessonFormData = new FormData();
          lessonFormData.append("title", lesson.title);
          lessonFormData.append("description", lesson.description);
          lessonFormData.append("notes", lesson.notes);
          lessonFormData.append("video", lesson.video);

          const getDuration = async () => {
            const url = URL.createObjectURL(lesson.video);
            return new Promise((resolve) => {
              const video = document.createElement("video");
              video.muted = true;
              const videoSource = document.createElement("source");
              videoSource.src = url;
              video.preload = "metadata";
              video.appendChild(videoSource);
              video.onloadedmetadata = () => {
                resolve(Math.round(video.duration));
              };
            });
          };

          lessonFormData.append("duration", await getDuration());

          const data = await createLesson(courseSlug, lessonFormData);

          data && toast.close(loadingToastId);
        }

        setCreatedLessonsList([]);
        toast({
          title: "Success",
          description: "Lessons created successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast.close(loadingToastId);
        toast({
          title: "Warning",
          description: "No lesson saved",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast.close(loadingToastId);
      setErrors([...errors, error]);
      toast({
        title: "Error",
        description: "Failed to create lessons",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addCreatedLessonList = () => {
    const areFieldsEmpty = Object.values(lessonCreateData).some(
      (value) => value === ""
    );
    if (areFieldsEmpty) {
      toast({
        title: "Warning",
        description:
          "Course creation information is missing (title, description and video required)",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else if (
      createdLessonsList &&
      createdLessonsList.includes(lessonCreateData)
    ) {
      toast({
        title: "Warning",
        description: "This Lesson already exist",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setCreatedLessonsList([...createdLessonsList, lessonCreateData]);
    }
  };

  const handleDeleteLesson = (lessonTitle) => {
    const filteredList = createdLessonsList.filter(
      (lesson) => lesson.title !== lessonTitle
    );
    setCreatedLessonsList(filteredList);
  };

  useEffect(() => {
    getCategories(searchQuery)
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => setErrors([...errors, error]));
  }, [searchQuery]);

  useEffect(() => {
    if (courseSlug) {
      getCourse(courseSlug).then((data) => setCourse(data));
    }
  }, [courseSlug]);

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
        {courseSlug && (
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              to="/"
              onClick={() => handleClick("courses")}
              fontWeight={500}
              opacity={0.9}
            >
              Courses
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink
            fontWeight={500}
            opacity={0.9}
            as={Link}
            to={courseSlug ? `/courses/course/${courseSlug}` : "/dashboard"}
          >
            {courseSlug ? course?.title : "Dashboard"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to={
              courseSlug
                ? `/create-course?course=${courseSlug}`
                : "/create-course"
            }
            onClick={() => setTargetScroll("")}
            fontWeight={500}
            opacity={0.9}
          >
            {courseSlug ? "Create lessons" : "Create course"}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box mt={responsive("", "1em", "1.5em")}>
        <Heading
          fontWeight={"600"}
          fontSize={responsive("", "2xl", "3xl")}
          color={"var(--secondary-color)"}
        >
          {courseSlug ? "Create lessons" : "Create course"}
        </Heading>
      </Box>
      <Grid
        mt={responsive("", "2em", "3em")}
        templateRows="repeat(auto-fill, minmax(1em, auto))"
        templateColumns={responsive("1fr", "repeat(3, 1fr)", "repeat(3, 1fr)")}
        gap={10}
      >
        <GridItem
          position={"relative"}
          rowSpan={10}
          colSpan={2}
          display={"flex"}
          flexDir={"column"}
          gap={"1em"}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          {courseSlug && (
            <Center
              backdropFilter={"blur(10px)"}
              zIndex={1}
              pos={"absolute"}
              top={0}
              left={0}
              w={"100%"}
              h={"100%"}
            >
              <Text
                fontWeight={"500"}
                opacity={"0.9"}
                fontSize={responsive("", "sm", "md")}
              >
                currently unavailable
              </Text>
            </Center>
          )}
          <Text
            fontWeight={"500"}
            fontSize={responsive("", "md", "lg")}
            w={"max-content"}
          >
            Course Information
          </Text>

          <Flex
            mt={responsive("", ".5em", "1em")}
            justify={"space-between"}
            align={"center"}
            gap={"1em"}
          >
            <Flex flexDir={"column"} gap={"1em"} w={"60%"}>
              <FormControl>
                <Input
                  bgColor={"white"}
                  h={"3em"}
                  borderWidth={"2px"}
                  type={"text"}
                  value={courseCreateData.title}
                  onChange={(e) => handleChangeForCourse(e)}
                  name={"title"}
                  placeholder="Course Title"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "unset",
                  }}
                  _hover={{ border: "2px dashed #cfcfcf" }}
                />
              </FormControl>
              <FormControl>
                <Textarea
                  bgColor={"white"}
                  borderWidth={"2px"}
                  name={"description"}
                  value={courseCreateData.description}
                  onChange={(e) => handleChangeForCourse(e)}
                  h={"14em"}
                  placeholder="Course Description"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "unset",
                  }}
                  _hover={{ border: "2px dashed #cfcfcf" }}
                ></Textarea>
              </FormControl>
            </Flex>
            <Box
              h={"15em"}
              border={"2px dashed #cfcfcf"}
              borderTop={"none"}
              borderBottom={"none"}
              borderLeft={"none"}
              mx={"1em"}
            ></Box>
            <Flex w={"40%"} flexDir={"column"} gap={"1em"} h={"18em"}>
              <FormControl mb={".5em"}>
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  display={"none"}
                  onChange={(e) => handleChangeForCourseImage(e)}
                  id="image"
                  placeholder="Course Title"
                />
                <Button
                  variant={"outline"}
                  bgColor={"var(--secondary-color)"}
                  color={"white"}
                  fontSize={responsive("", "sm", "md")}
                  border={"1px solid var(--secondary-color)"}
                  _hover={{
                    bgColor: "var(--bg-color)",
                  }}
                >
                  <FormLabel
                    h={"100%"}
                    w={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    htmlFor="image"
                    m={0}
                    _hover={{ color: "var(--secondary-color)" }}
                  >
                    <Text fontWeight={500} opacity={0.9}>
                      Select Your Thumbnail
                    </Text>
                  </FormLabel>
                </Button>
              </FormControl>
              <Text>{courseCreateData.image?.name}</Text>

              <FormControl>
                <Input
                  bgColor={"white"}
                  h={"3em"}
                  type={"number"}
                  borderWidth={"2px"}
                  name={"price"}
                  value={courseCreateData.price}
                  onChange={(e) => handleChangeForCourse(e)}
                  placeholder="course price"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "unset",
                  }}
                  _hover={{ border: "2px dashed #cfcfcf" }}
                ></Input>
              </FormControl>
              <FormControl>
                <VStack spacing={2}>
                  <Input
                    bgColor={"white"}
                    h={"3em"}
                    borderWidth={"2px"}
                    name={"category"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Select Category"
                    _focus={{
                      border: "2px dashed #cfcfcf",
                      boxShadow: "unset",
                    }}
                    _hover={{ border: "2px dashed #cfcfcf" }}
                    onFocus={() => setShowOptions(true)}
                  ></Input>
                  {showOptions && (
                    <Box
                      width="100%"
                      bgColor={"white"}
                      borderRadius={"5px"}
                      border={"1px solid #cfcfcf"}
                      overflow={"auto"}
                      maxH={"10em"}
                    >
                      <List>
                        {categories.map((option, index) => (
                          <ListItem
                            key={index}
                            p={2}
                            cursor="pointer"
                            onClick={() => handleSelect(option)}
                            fontWeight={"500"}
                            opacity={0.7}
                            _hover={{ opacity: "0.9" }}
                          >
                            {option.title}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </VStack>
              </FormControl>
            </Flex>
          </Flex>
        </GridItem>

        <GridItem colSpan={1} rowSpan={2}>
          <Center
            fontSize={responsive("", "md", "lg")}
            fontWeight={"500"}
            borderRadius={"10px"}
            onClick={() => {
              courseSlug
                ? handleLessonCreateSubmit(courseSlug)
                : handleCreateCourseSubmit();
            }}
            border={"2px dashed var(--secondary-color)"}
            p={responsive("", "1em", "1em")}
            color={"white"}
            bgColor={"var(--secondary-color)"}
            transition={"all .3s ease"}
            _hover={{
              bgColor: "white",
              color: "var(--secondary-color)",
              cursor: "pointer",
            }}
          >
            Create
          </Center>
        </GridItem>

        <GridItem
          rowSpan={20}
          colSpan={1}
          maxH={"50em"}
          display={"flex"}
          flexDir={"column"}
          gap={"1em"}
          p={"1em"}
          pr={0}
          borderRadius={"10px"}
          pb={"1em"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          <Text
            fontWeight={"500"}
            fontSize={responsive("", "md", "lg")}
            w={"max-content"}
          >
            Created Lessons
          </Text>
          <Flex
            mt={responsive("", ".5em", "1em")}
            align={"center"}
            gap={"1em"}
            flexDir={"column"}
            maxH={"100%"}
            overflow={"auto"}
            pr={"1em"}
            h={"100%"}
          >
            {createdLessonsList.length > 0 &&
              createdLessonsList.map((lesson, index) => (
                <Flex
                  key={index}
                  bgColor="white"
                  flexDir={"column"}
                  gap={"1em"}
                  p={responsive("", ".5em", "1em")}
                  borderRadius="10px"
                  w={"100%"}
                >
                  <Flex align={"center"} justify={"space-between"} w={"100%"}>
                    <Text
                      fontWeight={500}
                      fontSize={responsive("", "sm", "md")}
                    >
                      {lesson.title}
                    </Text>
                    <Center
                      bgColor={"var(--accent-color)"}
                      color={"white"}
                      p={".5em"}
                      border={"1px solid var(--accent-color)"}
                      borderRadius={"5px"}
                      transition={"ease .3s"}
                      cursor={"pointer"}
                      onClick={() => handleDeleteLesson(lesson.title)}
                      _hover={{
                        bgColor: "white",
                        color: "var(--accent-color)",
                      }}
                    >
                      <CloseIcon
                        fontWeight={"bolder"}
                        fontSize={responsive("", "2xs", "xs")}
                      ></CloseIcon>
                    </Center>
                  </Flex>
                  <Box>
                    <Text mb={".5em"}>Description</Text>
                    <Textarea
                      _focus={{
                        boxShadow: "none",
                        border: "2px dashed #cfcfcf",
                      }}
                      border={"2px dashed #cfcfcf"}
                      readOnly={true}
                      fontSize={responsive("", "sm", "md")}
                      fontWeight={500}
                      opacity={0.9}
                    >
                      {lesson.description}
                    </Textarea>
                  </Box>

                  <Box>
                    <Text mb={".5em"}>Notes</Text>
                    <Textarea
                      _focus={{
                        boxShadow: "none",
                        border: "2px dashed #cfcfcf",
                      }}
                      border={"2px dashed #cfcfcf"}
                      readOnly={true}
                      fontSize={responsive("", "sm", "md")}
                      fontWeight={500}
                      opacity={0.9}
                    >
                      {lesson.notes}
                    </Textarea>
                  </Box>
                  <Box>
                    <Text
                      fontSize={responsive("", "sm", "md")}
                      my={".5em"}
                      fontWeight={500}
                      borderBottom={"2px dashed #cfcfcf"}
                    >
                      Video
                    </Text>
                    <Text
                      border
                      fontWeight={500}
                      opacity={0.9}
                      fontSize={responsive("", "sm", "md")}
                    >
                      {lesson.video.name}
                    </Text>
                  </Box>
                </Flex>
              ))}
          </Flex>
        </GridItem>
        <GridItem
          rowSpan={10}
          colSpan={2}
          display={"flex"}
          flexDir={"column"}
          gap={"1em"}
          p={"1em"}
          borderRadius={"10px"}
          bgColor={"var(--bg-color)"}
          border={"2px dashed var(--secondary-color)"}
        >
          <Flex align={"center"} justify={"space-between"}>
            <Text
              fontWeight={"500"}
              fontSize={responsive("", "md", "lg")}
              w={"max-content"}
            >
              Create Lesson
            </Text>
            <Button
              variant={"outline"}
              bgColor={"var(--accent-color)"}
              color={"white"}
              onClick={() => addCreatedLessonList()}
              fontSize={responsive("", "sm", "md")}
              border={"1px solid var(--accent-color)"}
              _hover={{
                bgColor: "white",
                color: "var(--accent-color)",
              }}
            >
              Save
            </Button>
          </Flex>

          <Flex
            flexDir={"column"}
            gap={"1em"}
            w={"100%"}
            mt={responsive("", ".5em", "1em")}
          >
            <Flex align={"center"} gap={"1em"} w={"100%"}>
              <FormControl>
                <Input
                  bgColor={"white"}
                  h={"3em"}
                  borderWidth={"2px"}
                  type={"text"}
                  value={lessonCreateData.title}
                  onChange={(e) => handleChangeForLesson(e)}
                  name={"title"}
                  placeholder="Lesson Title"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "unset",
                  }}
                  _hover={{ border: "2px dashed #cfcfcf" }}
                />
              </FormControl>
              <FormControl w={"max-content"}>
                <Input
                  type="file"
                  name="video"
                  accept="video/*"
                  display={"none"}
                  onChange={(e) => handleChangeForLessonVideo(e)}
                  id="video"
                />
                <Button
                  variant={"outline"}
                  bgColor={"var(--accent-color)"}
                  color={"white"}
                  fontSize={responsive("", "sm", "md")}
                  border={"1px solid var(--accent-color)"}
                  _hover={{
                    bgColor: "var(--bg-color)",
                  }}
                >
                  <FormLabel
                    h={"100%"}
                    w={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    htmlFor="video"
                    m={0}
                    _hover={{ color: "var(--accent-color)" }}
                  >
                    <Text
                      fontWeight={500}
                      opacity={0.9}
                      fontSize={responsive("", "sm", "md")}
                    >
                      Select Your Video
                    </Text>
                  </FormLabel>
                </Button>
              </FormControl>
              <Text
                maxW={"20%"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                fontSize={responsive("", "sm", "md")}
              >
                {lessonCreateData.video?.name}
              </Text>
            </Flex>

            <Flex align={"center"} gap={"1em"}>
              <FormControl>
                <Textarea
                  bgColor={"white"}
                  borderWidth={"2px"}
                  name={"description"}
                  fontSize={responsive("", "sm", "md")}
                  value={lessonCreateData.description}
                  onChange={(e) => handleChangeForLesson(e)}
                  h={"14em"}
                  placeholder="Lesson Description"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "unset",
                  }}
                  _hover={{ border: "2px dashed #cfcfcf" }}
                ></Textarea>
              </FormControl>
              <FormControl>
                <Textarea
                  bgColor={"white"}
                  borderWidth={"2px"}
                  fontSize={responsive("", "sm", "md")}
                  name={"notes"}
                  value={lessonCreateData.notes}
                  onChange={(e) => handleChangeForLesson(e)}
                  h={"14em"}
                  placeholder="Lesson Notes"
                  _focus={{
                    border: "2px dashed #cfcfcf",
                    boxShadow: "unset",
                  }}
                  _hover={{ border: "2px dashed #cfcfcf" }}
                ></Textarea>
              </FormControl>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};
export default CourseCreate;
