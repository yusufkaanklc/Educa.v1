import {
  Flex,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
const Header = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <Box id="home"></Box>
      <Box
        m={"1em 10em"}
        bgColor={"white"}
        boxShadow={"md"}
        p={"1em"}
        h={"85px"}
        borderRadius={"10px"}
        pos={"sticky"}
        top={"1em"}
        background={"white"}
        zIndex={"999"}
      >
        <Flex justify={"space-between"} align={"center"}>
          <Flex align={"center"}>
            <Image w={"60px"} src="./hayvan.png"></Image>
            <Heading fontSize={"3xl"} fontWeight={"700"} letterSpacing={1}>
              Educa
            </Heading>
          </Flex>

          <Flex align={"center"} gap={"1.5em"}>
            <ChakraLink
              onClick={() => handleScroll("home")}
              fontSize={"lg"}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Home
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("about")}
              fontSize={"lg"}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              About us
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("courses")}
              fontSize={"lg"}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Courses
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("instructers")}
              fontSize={"lg"}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Instructers
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("events")}
              fontSize={"lg"}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Events
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("contact")}
              fontSize={"lg"}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Contact us
            </ChakraLink>
          </Flex>
          <Flex>
            <ChakraLink
              as={Link}
              to="/login"
              fontSize={"lg"}
              fontWeight={"500"}
              padding={".5em 1em"}
              opacity={0.8}
              border={"1px solid transparent"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              <Flex gap={"0.5em"} align={"center"}>
                <i
                  class="fi fi-rr-world"
                  style={{ position: "relative", top: "3px", fontSize: "20px" }}
                ></i>
                Login
              </Flex>
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/signup"
              fontSize={"lg"}
              position={"relative"}
              top={"2px"}
              color={"white"}
              padding={".5em 1.5em"}
              bgColor={"var(--primary-color)"}
              border={"1px solid transparent"}
              borderRadius={"30px"}
              fontWeight={"500"}
              transition={"all 0.5s ease"}
              _hover={{
                textDecoration: "none",
                opacity: 1,
                color: "black",
                bgColor: "white",
                border: "1px solid #007bff",
                transition: "all 0.5s ease",
              }}
            >
              Sign Up
            </ChakraLink>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
