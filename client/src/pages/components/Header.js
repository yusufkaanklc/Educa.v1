import {
  Flex,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dataContext from "../../utils/contextApi";
import { getAccount } from "../../utils/data/UsersData";
const Header = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { isMobile, isLaptop, account, setAccount } = useContext(dataContext);
  const [navVisible, setNavVisible] = useState(true);

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
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollTop = document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toast = useToast;

  useEffect(() => {
    getAccount(localStorage.getItem("token"))
      .then((data) => {
        console.log(data.user);
        setAccount(data.user);
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
    <>
      <Box id="home"></Box>
      <Box
        transform={navVisible ? "translateY(0)" : "translateY(-150%)"}
        transition={"0.5s ease"}
        m={responsive("", "1em 8em", "1em 10em")}
        bgColor={"white"}
        boxShadow={"md"}
        p={"1em"}
        h={responsive("", "4em", "5em")}
        borderRadius={"10px"}
        pos={"sticky"}
        top={"1em"}
        background={"white"}
        zIndex={"999"}
      >
        <Flex justify={"space-between"} align={"center"} h={"100%"}>
          <Flex align={"center"}>
            <Image w={responsive("", "3em", "5em")} src="./hayvan.png"></Image>
            <Heading
              fontSize={responsive("", "2xl", "3xl")}
              fontWeight={"700"}
              letterSpacing={1}
            >
              Educa
            </Heading>
          </Flex>

          <Flex align={"center"} gap={responsive("", "1em", "1.5em")}>
            <ChakraLink
              onClick={() => handleScroll("home")}
              fontSize={responsive("", "md", "lg")}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Home
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("about")}
              fontSize={responsive("", "md", "lg")}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              About us
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("courses")}
              fontSize={responsive("", "md", "lg")}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Courses
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("instructors")}
              fontSize={responsive("", "md", "lg")}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Instructors
            </ChakraLink>
            <ChakraLink
              onClick={() => handleScroll("events")}
              fontSize={responsive("", "md", "lg")}
              opacity={0.8}
              fontWeight={"500"}
              _hover={{ textDecoration: "none", opacity: 1, color: "black" }}
            >
              Events
            </ChakraLink>
          </Flex>
          <Flex>
            {!localStorage.getItem("token") ? (
              <>
                <ChakraLink
                  as={Link}
                  to="/login"
                  fontSize={responsive("", "md", "lg")}
                  fontWeight={"500"}
                  padding={".5em 1em"}
                  opacity={0.8}
                  border={"1px solid transparent"}
                  _hover={{
                    textDecoration: "none",
                    opacity: 1,
                    color: "black",
                  }}
                >
                  <Flex gap={"0.5em"} align={"center"}>
                    <i
                      class="fi fi-rr-world"
                      style={{
                        position: "relative",
                        top: "4px",
                        fontSize: responsive("", "15px", "20px"),
                      }}
                    ></i>
                    Login
                  </Flex>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/signup"
                  fontSize={responsive("", "md", "lg")}
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
              </>
            ) : (
              <Button>
                <i class="fi fi-rr-user"></i>
                {account.username}
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
