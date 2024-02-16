import {
  Box,
  Heading,
  Text,
  Center,
  Stack,
  Link as ChakraLink,
  Card,
  CardBody,
  Image,
  Flex,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import InstructorWomen from "./components/Instructor-woman";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  // const [courses, setCourses] = useState(null);
  // useEffect(() => {
  //   const fetchCourse = async () => {
  //     try {
  //       const courseData = await axios.get("/courses");
  //       setCourses(courseData.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchCourse();
  // }, []);

  // useEffect(() => {
  //   console.log(courses);
  // }, [courses]);
  return (
    <Box
      mx={"10em"}
      mt={"3em"}
      bgColor={"var(--bg-color)"}
      pt={"4em"}
      px={"2em"}
      borderRadius={"10px"}
      id="courses"
    >
      <Center>
        <Stack textAlign={"center"} gap={"1em"} maxW={"2xl"} mb={"3em"}>
          <Heading
            fontSize={"2xl"}
            fontWeight={"500"}
            color={"var(--secondary-color)"}
          >
            Featured Courses
          </Heading>
          <Heading fontSize={"4xl"}>Browse Our Popular Courses</Heading>
          <Text opacity={0.9} fontSize={"md"}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus,
            minima! Lorem ipsum dolor sit amet.
          </Text>
        </Stack>
      </Center>
      <Flex gap={"2em"} justify={"center"} flexWrap={"wrap"}>
        {courses &&
          courses.map((course, index) => (
            <Card key={index} maxW="sm" display={"flex"}>
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
                      fontSize={"sm"}
                    >
                      <Center
                        p={"5px 10px"}
                        border={"1px solid var(--secondary-color)"}
                        borderRadius={"5px"}
                        color={"var(--secondary-color)"}
                      >
                        {course.title}
                      </Center>
                      <Flex align={"center"} gap={"0.5em"}>
                        <Text fontSize={"sm"}>4.8</Text>
                        <StarIcon
                          color={"var(--accent-color)"}
                          pos={"relative"}
                          bottom={"1px"}
                        ></StarIcon>
                      </Flex>
                    </Flex>
                    <Text>{course.description}</Text>
                  </Box>
                  <Box>
                    <Flex
                      mt={"1em"}
                      justify={"space-between"}
                      align={"center"}
                      fontSize={"sm"}
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
                    <Flex align={"center"} mt={"1em"} justify={"space-between"}>
                      <Flex align={"center"} gap={"0.5em"}>
                        <InstructorWomen />
                        <Text fontWeight={"600"}>
                          {course.ownership.username}
                        </Text>
                      </Flex>
                      <Text fontWeight={600} color={"var(--primary-color)"}>
                        {"$" + course.price}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          ))}
      </Flex>
      <Center py={"3em"}>
        <ChakraLink
          as={Link}
          to="/courses"
          fontSize={"md"}
          color={"black"}
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
            bgColor: "white",
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
