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
import { getAccount, logout } from "../../utils/data/UsersData";
import Cookies from "js-cookie";
const Header = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { isMobile, isLaptop, account, setAccount, setIsLogin } =
    useContext(dataContext);
  const [navVisible, setNavVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = () => {
    logout()
      .then(() => {
        Cookies.remove("isLoggedIn");
        setAccount(null);
        setIsLogin(false);
        toast({
          title: "Logout",
          description: "You have been logged out",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
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
  };

  useEffect(() => {
    let lastScrollTop = 0;
    let treshold = 100;
    const handleScroll = () => {
      const currentScrollTop = document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop && currentScrollTop > treshold) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    if (Cookies.get("isLoggedIn")) {
      getAccount()
        .then((data) => {
          if (Cookies.get("isLoggedIn")) {
            setAccount(data);
          }
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
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Box id="home"></Box>
      <Box
        transform={
          !isMenuOpen && (navVisible ? "translateY(0)" : "translateY(-150%)")
        }
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
            <Image w={responsive("", "3em", "5em")} src="/hayvan.png"></Image>
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
            {!account ? (
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
              <Box position={"relative"}>
                <Button
                  border={"2px dashed #cfcfcf"}
                  bgColor={"white"}
                  borderRadius={"10px"}
                  color={"black"}
                  minW={"6em"}
                  fontWeight={"500"}
                  opacity={0.8}
                  fontSize={responsive("", "md", "lg")}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {account.username}
                </Button>
                {isMenuOpen && (
                  <>
                    <Flex
                      border={"2px dashed #cfcfcf"}
                      flexDir={"column"}
                      gap={responsive("", ".5em", ".7em")}
                      bgColor={"white"}
                      p={".5em 1em"}
                      position={"absolute"}
                      width={"160%"}
                      right={0}
                      borderRadius={"10px"}
                      mt={".5em"}
                    >
                      {account.role === "student" ? (
                        <ChakraLink
                          as={Link}
                          to=""
                          fontSize={responsive("", "md", "lg")}
                          transition={"all 0.5s ease"}
                          _hover={{ textDecoration: "none" }}
                        >
                          <i
                            class="fi fi-rr-file-signature"
                            style={{ position: "relative", top: "3px" }}
                          ></i>
                          &nbsp; Enrollments
                        </ChakraLink>
                      ) : (
                        <>
                          <ChakraLink
                            as={Link}
                            to=""
                            fontSize={responsive("", "md", "lg")}
                            transition={"all 0.5s ease"}
                            _hover={{ textDecoration: "none" }}
                          >
                            <i
                              class="fi fi-rr-chart-pie-alt"
                              style={{ position: "relative", top: "3px" }}
                            ></i>
                            &nbsp; Dashboard
                          </ChakraLink>
                        </>
                      )}
                      <ChakraLink
                        as={Link}
                        to="/account"
                        fontSize={responsive("", "md", "lg")}
                        transition={"all 0.5s ease"}
                        _hover={{ textDecoration: "none" }}
                      >
                        <i
                          class="fi fi-rr-user-pen"
                          style={{ position: "relative", top: "3px" }}
                        ></i>
                        &nbsp; Account
                      </ChakraLink>
                      <ChakraLink
                        onClick={() => handleLogout()}
                        fontSize={responsive("", "md", "lg")}
                        transition={"all 0.5s ease"}
                        _hover={{ textDecoration: "none" }}
                      >
                        <i
                          class="fi fi-rr-sign-out-alt"
                          style={{ position: "relative", top: "3px" }}
                        ></i>
                        &nbsp; Logout
                      </ChakraLink>
                    </Flex>
                  </>
                )}
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
