import { Box, Flex, Text, Stack, Heading, Center } from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import dataContext from "../../utils/contextApi";
const About = () => {
  const { users, courses, teachers, setTeachers, isMobile, isLaptop } =
    useContext(dataContext);
  const [lessons, setLessons] = useState([]);

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
    let filteredTeachers = [];
    for (const user of users) {
      if (user.role === "teacher") filteredTeachers.push(user);
    }
    setTeachers(filteredTeachers);
  }, [users]);

  useEffect(() => {
    const lessonList = [];
    if (courses && courses.length > 0) {
      for (const course of courses) {
        for (const lesson of course.lessons) {
          lessonList.push(lesson);
        }
      }
    }
    setLessons(lessonList);
  }, [courses]);

  return (
    <Box
      mx={responsive("", "8em", "10em")}
      mb={responsive("", "6em", "8em")}
      id="about"
    >
      <Flex
        bgColor={"var(--primary-color)"}
        align={"center"}
        justify={"space-around"}
        p={responsive("", "2em 4em", "3em 5em")}
        borderRadius={"10px"}
      >
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={responsive("", "5xl", "6xl")} fontWeight={"600"}>
            {courses && courses.length}
          </Text>
          <Text>Online Courses</Text>
        </Stack>
        <Box
          w={"4px"}
          h={responsive("", "4em", "5em")}
          bgColor={"white"}
          opacity={0.2}
        ></Box>
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={responsive("", "5xl", "6xl")} fontWeight={"600"}>
            {lessons.length}
          </Text>
          <Text>Lessons</Text>
        </Stack>
        <Box
          w={"4px"}
          h={responsive("", "4em", "5em")}
          bgColor={"white"}
          opacity={0.2}
        ></Box>
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={responsive("", "5xl", "6xl")} fontWeight={"600"}>
            {teachers.length}
          </Text>
          <Text>Expert Instructor</Text>
        </Stack>{" "}
        <Box
          w={"4px"}
          h={responsive("", "4em", "5em")}
          bgColor={"white"}
          opacity={0.2}
        ></Box>
        <Stack color={"white"} textAlign={"center"}>
          <Text fontSize={responsive("", "5xl", "6xl")} fontWeight={"600"}>
            {users.length}
          </Text>
          <Text>Worldwide Members</Text>
        </Stack>
      </Flex>
      <Flex
        w={"100%"}
        align={"center"}
        justify={"space-between"}
        mt={responsive("", "2em", "3em")}
      >
        <Stack
          gap={responsive("", "1.2em", "1.5em")}
          w={responsive("", "40%", "50%")}
        >
          <Heading
            fontSize={responsive("", "xl", "2xl")}
            color={"var(--secondary-color)"}
            fontWeight={"500"}
          >
            Who Are We
          </Heading>
          <Heading fontSize={responsive("", "3xl", "4xl")} fontWeight={"700"}>
            Your Online Learning Partner
          </Heading>
          <Text opacity={0.9} w={"80%"} fontSize={responsive("", "sm", "md")}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente
            obcaecati quos eius rem rerum. Totam velit architecto ex corrupti
            quia. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Eligendi, mollitia!
          </Text>
        </Stack>
        <Box
          mt={responsive("", "1em", "2em")}
          w={"45%"}
          bgColor={"var(--bg-color)"}
          p={responsive("", "1.5em", "2em ")}
          borderRadius={"10px"}
        >
          <Flex
            width={"100%"}
            justify={"space-between"}
            mb={responsive("", ".7em", "1em")}
          >
            <Text fontWeight={"600"} fontSize={responsive("", "sm", "md")}>
              Video Course
            </Text>
            <Text fontWeight={"600"} fontSize={responsive("", "sm", "md")}>
              (1/100)
            </Text>
          </Flex>
          <Flex
            align={"center"}
            justify={"space-between"}
            bgColor={"var(--primary-color)"}
            borderRadius={"5px"}
            p={".5em 1em"}
            mb={"1em"}
          >
            <Flex align={"center"} gap={"2em"}>
              <i
                class="fi fi-rr-play-circle"
                style={{
                  fontSize: responsive("", "25px", "30px"),
                  color: "white",
                  position: "relative",
                  top: "3px",
                }}
              ></i>
              <Text color={"white"} fontSize={responsive("", "sm", "md")}>
                Introduction
              </Text>
            </Flex>
            <Text color={"white"} fontSize={responsive("", "sm", "md")}>
              7:00
            </Text>
          </Flex>
          <Flex
            align={"center"}
            justify={"space-between"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={".5em 1em"}
            mb={"1em"}
          >
            <Flex align={"center"} gap={"2em"}>
              <i
                class="fi fi-brands-node-js"
                style={{
                  fontSize: responsive("", "25px", "30px"),
                  color: "var(--primary-color)",
                  position: "relative",
                  top: "3px",
                }}
              ></i>
              <Text color={"black"} fontSize={responsive("", "sm", "md")}>
                Node.js
              </Text>
            </Flex>
            <Text color={"black"} fontSize={responsive("", "sm", "md")}>
              7:00
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Flex
        align={"center"}
        justify={"space-between"}
        mt={responsive("", "4em", "5em")}
        flexWrap={"wrap"}
      >
        <Box
          bgColor={"var(--bg-color)"}
          p={responsive("", "1.5em", "2em")}
          borderRadius={"10px"}
          maxWidth={responsive("", "300px", "400px")}
        >
          <Center
            w={responsive("", "40px", "50px")}
            h={responsive("", "40px", "50px")}
            bgColor={"var(--primary-color)"}
            borderRadius={"5px"}
            mb={responsive("", ".7em", "1em")}
          >
            <i
              class="fi fi-rr-book-alt"
              style={{
                fontSize: responsive("", "15px", "20px"),
                position: "relative",
                top: "2px",
                color: "white",
              }}
            ></i>
          </Center>
          <Stack>
            <Heading fontSize={responsive("", "xl", "2xl")}>
              Online Courses
            </Heading>
            <Text fontSize={responsive("", "xs", "sm")}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Architecto, atque. Lorem ipsum dolor sit amet.
            </Text>
          </Stack>
        </Box>
        <Box
          bgColor={"var(--bg-color)"}
          p={responsive("", "1.5em", "2em")}
          borderRadius={"10px"}
          maxWidth={responsive("", "300px", "400px")}
        >
          <Center
            w={responsive("", "40px", "50px")}
            h={responsive("", "40px", "50px")}
            bgColor={"var(--secondary-color)"}
            borderRadius={"5px"}
            mb={responsive("", ".7em", "1em")}
          >
            <i
              class="fi fi-rr-upload"
              style={{
                fontSize: responsive("", "15px", "20px"),
                position: "relative",
                top: "2px",
                color: "white",
              }}
            ></i>
          </Center>
          <Stack>
            <Heading fontSize={responsive("", "xl", "2xl")}>
              Upgrade Skills
            </Heading>
            <Text fontSize={responsive("", "xs", "sm")}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Architecto Lorem ipsum dolor sit amet.
            </Text>
          </Stack>
        </Box>
        <Box
          bgColor={"var(--bg-color)"}
          p={responsive("", "1.5em", "2em")}
          borderRadius={"10px"}
          maxWidth={responsive("", "300px", "400px")}
        >
          <Center
            w={responsive("", "40px", "50px")}
            h={responsive("", "40px", "50px")}
            bgColor={"var(--accent-color)"}
            borderRadius={"5px"}
            mb={responsive("", ".7em", "1em")}
          >
            <i
              class="fi fi-rr-badge"
              style={{
                fontSize: responsive("", "15px", "20px"),
                position: "relative",
                top: "2px",
                color: "white",
              }}
            ></i>
          </Center>
          <Stack>
            <Heading fontSize={responsive("", "xl", "2xl")}>
              Certification
            </Heading>
            <Text fontSize={responsive("", "xs", "sm")}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
              ipsum dolor sit amet. Architecto
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default About;
