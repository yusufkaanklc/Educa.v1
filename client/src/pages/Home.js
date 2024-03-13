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
import InstructorWoman from "./components/Instructor-woman";
import InstructorMan from "./components/Instructor-man";
import Header from "./components/Header";
import About from "./components/About";
import Courses from "./components/Courses";
import Instructors from "./components/Instructors";
import Events from "./components/Events";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import dataContext from "../utils/contextApi";

const Home = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { isMobile, isLaptop, targetScroll } = useContext(dataContext);

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
    if (targetScroll !== "") {
      const element = document.getElementById(targetScroll);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetScroll]);

  return (
    <>
      <Header />
      <Box
        m={responsive("0 1em", "6em 7em", "10em 8em")}
        pt={isMobile && "4em"}
        pb={isMobile && "2em"}
      >
        <Heading
          fontSize={responsive("xl", "2xl", "3xl")}
          fontWeight={500}
          color={"var(--secondary-color)"}
          textAlign={"center"}
          mb={"1em"}
        >
          Education & Online Course
        </Heading>
        <Flex
          justify={!isMobile && "space-between"}
          mb={"1em"}
          flexDir={isMobile ? "column" : "row"}
        >
          {!isMobile && <Box w={responsive("", "150px", "180px")}></Box>}
          <Heading
            fontSize={responsive("3xl", "5xl", "7xl")}
            w={isMobile ? "100%" : "60%"}
            textAlign={"center"}
          >
            Learn Without Limits With Educa
          </Heading>
          {!isMobile && (
            <Box
              borderColor={"var(--accent-color)"}
              borderWidth={"3px"}
              borderStyle={"dashed"}
              borderLeft={"transparent"}
              borderBottom={"transparent"}
              borderRadius={" 0 100% 0  0  "}
              w={isLaptop ? "150px" : "180px"}
              h={"140px"}
              position={"relative"}
              right={responsive("", "8.5%", "10%")}
              top={responsive("", "1.5em", "3em")}
            >
              <ChevronDownIcon
                pos={"absolute"}
                bottom={-3}
                right={-4}
                color={"var(--accent-color)"}
                fontSize={"3xl"}
              ></ChevronDownIcon>
            </Box>
          )}
        </Flex>
        <Flex justify={"space-between"}>
          {!isMobile && (
            <Box
              mt={responsive("", "3em", "4em")}
              w={"25%"}
              position={"relative"}
              left={responsive("", "3em", "5em")}
            >
              <Flex gap={"0.5em"}>
                <StarIcon
                  fontSize={responsive("", "15px", "20px")}
                  color={"var(--accent-color)"}
                ></StarIcon>
                <StarIcon
                  fontSize={responsive("", "15px", "20px")}
                  color={"var(--accent-color)"}
                ></StarIcon>
                <StarIcon
                  fontSize={responsive("", "15px", "20px")}
                  color={"var(--accent-color)"}
                ></StarIcon>
                <StarIcon
                  fontSize={responsive("", "15px", "20px")}
                  color={"var(--accent-color)"}
                ></StarIcon>
                <StarIcon fontSize={responsive("", "15px", "20px")}></StarIcon>
              </Flex>
              <Text fontSize={responsive("", "xs", "sm")} my={"1em"}>
                "This course was comprehensive and covered everything i needed
                to know about animation"
              </Text>
              <Flex gap={"1em"} align={"center"}>
                <InstructorWoman />
                <Stack gap={0}>
                  <Text
                    fontWeight={"bold"}
                    fontSize={responsive("", "xs", "sm")}
                  >
                    Emily Brown
                  </Text>
                  <Text fontSize={responsive("", "x-small", "small")}>
                    UI/UX Designer
                  </Text>
                </Stack>
              </Flex>
            </Box>
          )}
          <Flex flexDir={"column"} align={"center"}>
            <Text
              w={isMobile ? "100%" : "65%"}
              textAlign={"center"}
              opacity={0.9}
              fontSize={responsive("sm", "sm", "md")}
            >
              Start, switch, or advance your career with more than 5,400
              courses, Professional Certificates, and degrees from world-class
              universities and companies.
            </Text>
            <Flex></Flex>
            <ChakraLink
              mt={"2em"}
              as={Link}
              to="/signup"
              fontSize={responsive("xs", "sm", "md")}
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
          {!isMobile && (
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
                <Text fontWeight={"bold"} fontSize={responsive("", "xs", "sm")}>
                  Thomas Musk
                </Text>
                <Text fontSize={responsive("", "x-small", "small")}>
                  Web Developer
                </Text>
              </Stack>
            </Flex>
          )}
        </Flex>
        {!isMobile && (
          <Flex mt={responsive("", "2em", "5em")} justify={"center"}>
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
        )}
      </Box>
      <About />
      <Courses />
      <Instructors />
      <Events />

      <Footer />
    </>
  );
};

export default Home;
