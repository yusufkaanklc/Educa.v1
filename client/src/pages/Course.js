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
  Image,
  Center,
  Stack,
  Grid,
  GridItem,
  Progress,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import dataContext from "../utils/contextApi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourse } from "../utils/data/CoursesData";
import { useToast } from "@chakra-ui/react";

const Course = () => {
  const { course, setCourse, isMobile, isLaptop, setTargetScroll } =
    useContext(dataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [starList, setStarList] = useState([]);

  const { slug } = useParams();
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

  useEffect(() => {
    setIsLoading(true);
    getCourse(slug)
      .then((data) => {
        setCourse(data);
        setIsLoading(false);
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

    console.log(course.enrollments);
  }, [course]);

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
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontWeight={500}
                  opacity={0.9}
                  onClick={() => handleClick("courses")}
                >
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink fontWeight={500} opacity={0.9}>
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
          templateRows="repeat(20, 1em)"
          templateColumns="repeat(2, 1fr)"
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
          templateRows="repeat(20, 1em)"
          templateColumns="repeat(2, 1fr)"
          gap={10}
        >
          <GridItem
            borderRadius={"10px"}
            rowSpan={7}
            border={"2px dashed var(--secondary-color)"}
            colSpan={1}
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
                color={"white"}
                _hover={{
                  bgColor: "var(--bg-color)",
                  color: "orange",
                  border: "1px solid var(--accent-color)",
                }}
              >
                Start course
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
              w={"min-content"}
              minW={"15%"}
            >
              {course.ownerName}
            </Center>
            <Flex
              w={"100%"}
              gap={responsive("", "2em", "3em")}
              align={"center"}
            >
              <Text fontSize={responsive("", "xs", "sm")} w={"63%"}>
                {course.ownerIntroduce}
              </Text>
              <Box w={"30%"} overflow={"hidden"} borderRadius={"10px"}>
                <Image src="/teacher1.jpg" />
              </Box>
            </Flex>
          </GridItem>

          <GridItem
            borderRadius={"10px"}
            rowSpan={19}
            colSpan={1}
            bgColor={"var(--bg-color)"}
            p={responsive("", "1em", "2em 1em")}
          >
            <Heading fontSize={responsive("", "xl", "2xl")}>Lessons</Heading>
          </GridItem>
          <GridItem
            border={"2px dashed transparent"}
            borderRadius={"10px"}
            rowSpan={2}
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
                <Text>Course Details</Text>
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
                  <Text>
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
                  <Text>45 Hours</Text>
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
                  <Text>{course.lessons && course.lessons.length} Lessons</Text>
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
