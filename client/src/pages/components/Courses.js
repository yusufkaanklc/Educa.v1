import {
  Box,
  Heading,
  Text,
  Center,
  Stack,
  Link as ChakraLink,
  Card,
  CardBody,
  Skeleton,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import InstructorWomen from "./Instructor-woman";
import { Link } from "react-router-dom";
import dataContext from "../../utils/contextApi";
import { getCourses } from "../../utils/data/CoursesData";

const Courses = () => {
  const { setCourses, courses, isMobile, isLaptop } = useContext(dataContext);
  const [popularCourses, setPopularCourses] = useState([]);

  const responsive = (mobile, laptop, desktop) => {
    if (isMobile) {
      return mobile;
    } else if (isLaptop) {
      return laptop;
    } else {
      return desktop;
    }
  };

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setPopularCourses(courses.slice(0, 6));
  }, [courses]);

  return (
    <Box
      border={"2px dashed #cfcfcf"}
      mx={responsive("", "8em", "10em")}
      mb={responsive("", "6em", "8em")}
      bgColor={"var(--bg-color)"}
      py={responsive("", "3em", "4em")}
      borderRadius={"10px"}
      id="courses"
    >
      <Center>
        <Stack
          textAlign={"center"}
          gap={responsive("", ".75em", "1em")}
          maxW={"2xl"}
        >
          <Heading
            fontSize={responsive("", "xl", "2xl")}
            fontWeight={"500"}
            color={"var(--secondary-color)"}
          >
            Featured Courses
          </Heading>
          <Heading fontSize={responsive("", "3xl", "4xl")}>
            Browse Our Popular Courses
          </Heading>
          <Text opacity={0.9} fontSize={responsive("", "sm", "md")}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus,
            minima! Lorem ipsum dolor sit amet.
          </Text>
        </Stack>
      </Center>
      <Flex
        gap={responsive("", "1em", "2em")}
        justify={"center"}
        flexWrap={"wrap"}
        mt={responsive("", "3em", "4em")}
      >
        {popularCourses.length > 0 ? (
          popularCourses.map((course, index) => (
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
              <Card maxW={responsive("", "xs", "sm")} display={"flex"}>
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

      <Center pt={"3em"}>
        <ChakraLink
          as={Link}
          to="/courses"
          fontSize={"md"}
          color={"white"}
          padding={".8em 1.5em"}
          bgColor={"#FFD05A"}
          border={"1px solid transparent"}
          borderRadius={"30px"}
          fontWeight={"500"}
          transition={"all 0.5s ease"}
          _hover={{
            textDecoration: "none",
            opacity: 1,
            color: "black",
            bgColor: "transparent",
            border: "1px solid #FFD05A",
            transition: "all 0.5s ease",
          }}
        >
          Explore All Course
        </ChakraLink>
      </Center>
    </Box>
  );
};

export default Courses;
