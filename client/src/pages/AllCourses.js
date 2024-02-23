import {
  Box,
  Heading,
  Center,
  Flex,
  Skeleton,
  Text,
  Link as ChakraLink,
  Card,
  CardBody,
  Image,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { StarIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import dataContext from "../utils/contextApi";
import InstructorWomen from "./components/Instructor-woman";
import { getCourses } from "../utils/data/CoursesData";
import { useContext, useEffect, useState } from "react";

const AllCourses = () => {
  const { isLaptop, isMobile, setTargetScroll } = useContext(dataContext);
  const [courses, setCourses] = useState([]);

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

  const toast = useToast();

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
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
  }, []);

  return (
    <Box
      border={"2px dashed #cfcfcf"}
      borderRadius={"10px"}
      bgColor={"var(--bg-color)"}
      p={responsive("", "2em  1em ", "4em 1em")}
      mx={responsive("", "8em", "10em")}
      my={responsive("", "2em", "3em")}
    >
      <Center mb={responsive("", "1em ", "2em")}>
        <Heading
          fontSize={responsive("", "xl", "2xl")}
          fontWeight={"500"}
          color={"var(--secondary-color)"}
        >
          All Courses
        </Heading>
      </Center>
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
          <BreadcrumbLink
            fontWeight={500}
            opacity={0.9}
            as={Link}
            to={"/all-courses"}
          >
            All Courses
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex
        gap={responsive("", "1em", "2em")}
        justify={"center"}
        flexWrap={"wrap"}
        mt={responsive("", "3em", "4em")}
      >
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <ChakraLink
              as={Link}
              to={`/course/${course.slug}`}
              key={index}
              border={"2px solid transparent"}
              borderRadius={"10px"}
              _hover={{
                textDecoration: "none",
                borderRadius: "10px",
                border: "2px dashed #cfcfcf",
              }}
            >
              <Card
                maxW={responsive("", "xs", "sm")}
                display={"flex"}
                h={"100%"}
              >
                <CardBody>
                  <Flex flexDir={"column"} justify={"space-between"} h={"100%"}>
                    <Box>
                      <Image
                        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        alt="Green double couch with wooden legs"
                        borderRadius="lg"
                      />
                      <Flex
                        my={"1em"}
                        justify={"space-between"}
                        align={"center"}
                        fontSize={responsive("xxs", "xs", "sm")}
                      >
                        <Center
                          p={responsive("", "2px 5px", "3px 7px", "5px 10px")}
                          border={"1px solid var(--secondary-color)"}
                          borderRadius={"5px"}
                          color={"var(--secondary-color)"}
                        >
                          {course.title}
                        </Center>
                        <Flex align={"center"} gap={"0.5em"}>
                          <Text fontSize={responsive("xxs", "xs", "sm")}>
                            {course.point ? course.point : 0}
                          </Text>
                          <StarIcon
                            color={"var(--accent-color)"}
                            pos={"relative"}
                            bottom={"1px"}
                          ></StarIcon>
                          <Text>({course.commentCount})</Text>
                        </Flex>
                      </Flex>
                      <Text fontSize={responsive("", "sm", "md")}>
                        {course.description.substring(0, 100 - 3) + "..."}
                      </Text>
                    </Box>
                    <Box>
                      <Flex
                        mt={responsive("", ".5em", "1em")}
                        justify={"space-between"}
                        align={"center"}
                        fontSize={responsive("xxs", "xs", "sm")}
                      >
                        <Flex gap={"0.5em"} align={"center"}>
                          <i
                            class="fi fi-rr-book-alt"
                            style={{ position: "relative", top: "2px" }}
                          ></i>
                          <Text>{course.lessons.length + " lessons"}</Text>
                        </Flex>
                        <Flex gap={"0.5em"} align={"center"}>
                          <i
                            class="fi fi-rr-clock-three"
                            style={{ position: "relative", top: "2px" }}
                          ></i>
                          <Text>24 h 40 min</Text>
                        </Flex>
                      </Flex>
                      <Flex
                        align={"center"}
                        mt={"1em"}
                        justify={"space-between"}
                      >
                        <Flex align={"center"} gap={"0.5em"}>
                          <InstructorWomen />
                          <Text
                            fontWeight={"600"}
                            maxW={responsive("", "70%", "80%")}
                            fontSize={responsive("", "sm", "md")}
                          >
                            {course.ownership}
                          </Text>
                        </Flex>
                        <Text
                          fontWeight={600}
                          fontSize={responsive("", "sm", "md")}
                          color={"var(--primary-color)"}
                        >
                          {"$" + course.price}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </ChakraLink>
          ))
        ) : (
          <>
            <Skeleton
              h={responsive("", "20em", "25em")}
              w={responsive("", "xs", "sm")}
              borderRadius={"10px"}
            />
            <Skeleton
              h={responsive("", "20em", "25em")}
              w={responsive("", "xs", "sm")}
              borderRadius={"10px"}
            />
            <Skeleton
              h={responsive("", "20em", "25em")}
              w={responsive("", "xs", "sm")}
              borderRadius={"10px"}
            />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default AllCourses;
