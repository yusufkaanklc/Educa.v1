import {
  Flex,
  Text,
  Stack,
  Heading,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { StarIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Header from "./components/Header";
import About from "./About";
import Courses from "./Courses";
import InstructorWoman from "./components/Instructor-woman";
import InstructorMan from "./components/Instructor-man";

const Home = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    console.log(element);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <Header />
      <Box mx={"10em"} mt={"8em"} h={"75vh"}>
        <Heading
          fontSize={"2xl"}
          fontWeight={500}
          color={"var(--secondary-color)"}
          textAlign={"center"}
          mb={"1em"}
        >
          Education & Online Course
        </Heading>
        <Flex justify={"space-between"} mb={"2em"}>
          <Box w={"180px"}></Box>
          <Heading fontSize={"7xl"} w={"60%"} textAlign={"center"}>
            Learn Without Limits With Educa
          </Heading>
          <Box
            borderColor={"var(--accent-color)"}
            borderWidth={"3px"}
            borderStyle={"dashed"}
            borderLeft={"transparent"}
            borderBottom={"transparent"}
            borderRadius={" 0 100% 0  0  "}
            w={"180px"}
            h={"150px"}
            position={"relative"}
            right={"10%"}
            top={"3em"}
          >
            <ChevronDownIcon
              pos={"absolute"}
              bottom={-3}
              right={-4}
              color={"var(--accent-color)"}
              fontSize={"3xl"}
            ></ChevronDownIcon>
          </Box>
        </Flex>
        <Flex justify={"space-between"}>
          <Box mt={"4em"} w={"25%"} position={"relative"} left={"5em"}>
            <Flex gap={"0.5em"}>
              <StarIcon
                fontSize={"20px"}
                color={"var(--accent-color)"}
              ></StarIcon>
              <StarIcon
                fontSize={"20px"}
                color={"var(--accent-color)"}
              ></StarIcon>
              <StarIcon
                fontSize={"20px"}
                color={"var(--accent-color)"}
              ></StarIcon>
              <StarIcon
                fontSize={"20px"}
                color={"var(--accent-color)"}
              ></StarIcon>
              <StarIcon fontSize={"20px"}></StarIcon>
            </Flex>
            <Text fontSize={"sm"} my={"1em"}>
              "This course was comprehensive and covered everything i needed to
              know about animation"
            </Text>
            <Flex gap={"1em"} align={"center"}>
              <InstructorWoman />
              <Stack gap={0}>
                <Text fontWeight={"bold"} fontSize={"sm"}>
                  Emily Brown
                </Text>
                <Text fontSize={"small"}>UI/UX Designer</Text>
              </Stack>
            </Flex>
          </Box>
          <Flex flexDir={"column"} align={"center"}>
            <Text w={"65%"} textAlign={"center"} opacity={0.9}>
              Start, switch, or advance your career with more than 5,400
              courses, Professional Certificates, and degrees from world-class
              universities and companies.
            </Text>
            <Flex></Flex>
            <ChakraLink
              mt={"2em"}
              as={Link}
              to="/signup"
              fontSize={"md"}
              position={"relative"}
              top={"2px"}
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
                bgColor: "white",
                border: "1px solid #FFD05A",
                transition: "all 0.5s ease",
              }}
            >
              Join for Free
            </ChakraLink>
          </Flex>
          <Flex
            flexDir={"column"}
            gap={".5em"}
            align={"center"}
            w={"25%"}
            position={"relative"}
            top={"1em"}
          >
            <InstructorMan />
            <Stack gap={"0"} textAlign={"right"}>
              <Text fontWeight={"bold"}>Thomas Musk</Text>
              <Text fontSize={"small"}>Web Developer</Text>
            </Stack>
          </Flex>
        </Flex>
        <Flex mt={"5em"} justify={"center"}>
          <Flex
            onClick={() => handleScroll("about")}
            align={"center"}
            cursor={"pointer"}
            transition={"all 0.5s ease"}
            _hover={{
              transition: "all 0.5s ease",
              color: "var(--accent-color)",
              transform: "translateY(10px)",
            }}
          >
            <i
              class="fi fi-rr-mouse"
              style={{ fontSize: "25px", position: "relative", top: "2px" }}
            ></i>
            <Text fontWeight={"600"} ml={".5em"}>
              Scroll Down
            </Text>
          </Flex>
        </Flex>
      </Box>
      <About />
      <Courses />
    </>
  );
};

export default Home;
