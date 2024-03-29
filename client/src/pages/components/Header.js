import {
  Flex,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
  Button,
  useToast,
  useDisclosure,
  Drawer,
  Center,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import dataContext from "../../utils/contextApi";
import { logout } from "../../utils/data/UsersData";
import Cookies from "js-cookie";
const Header = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const {
    isMobile,
    isLaptop,
    account,
    setAccount,
    setIsLogin,
    setUserRole,
    setErrors,
    setCourseCreateData,
    setLessonCreateData,
    setCourseUpdateData,
    setSearchQuery,
    setCreatedLessonsList,
  } = useContext(dataContext);
  const [navVisible, setNavVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

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
        Cookies.remove("role");
        setAccount(null);
        setCourseCreateData({
          title: "",
          description: "",
          image: "",
          category: "",
          price: "",
        });
        setLessonCreateData({
          title: "",
          description: "",
          video: "",
          notes: "",
        });
        setCourseUpdateData({
          title: "",
          description: "",
          price: "",
        });
        setSearchQuery("");
        setCreatedLessonsList([]);
        setErrors([]);
        setIsLogin(false);
        setUserRole(null);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <Box position={"fixed"} zIndex={"99"}>
            <Button
              ref={btnRef}
              m={"1em"}
              variant={"outline"}
              bgColor={"white"}
              opacity={0.5}
              color={"var(--primary-color)"}
              onClick={() => onOpen()}
              size={"sm"}
              border={"1px solid var(--primary-color)"}
              _hover={{
                bgColor: "var(--primary-color)",
                color: "white",
                opacity: "1",
              }}
            >
              <i
                class="fi fi-rr-menu-burger"
                style={{ position: "relative", top: "2px" }}
              ></i>
            </Button>
          </Box>
          <Box id="home"></Box>
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            size={"xs"}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader>
                <Flex align={"center"} justify={"space-between"}>
                  <Flex align={"center"}>
                    <Image
                      w={responsive("2em", "3em", "5em")}
                      src="/hayvan.png"
                    ></Image>
                    <Heading
                      fontSize={responsive("lg", "2xl", "3xl")}
                      fontWeight={"700"}
                      letterSpacing={1}
                    >
                      Educa
                    </Heading>
                  </Flex>
                  <DrawerCloseButton
                    left={"2px"}
                    pos={"relative"}
                    top={"1px"}
                  />
                </Flex>
              </DrawerHeader>

              <DrawerBody my={"1em"}>
                <Flex flexDir={"column"} gap={"1em"}>
                  <ChakraLink
                    onClick={() => {
                      handleScroll("home");
                      onClose();
                    }}
                    fontSize={responsive("", "md", "lg")}
                    opacity={0.8}
                    fontWeight={"500"}
                    _hover={{
                      textDecoration: "none",
                      opacity: 1,
                      color: "black",
                    }}
                  >
                    <Flex align={"center"} gap={".5em"}>
                      <i
                        class="fi fi-rr-home"
                        style={{ position: "relative", top: "1px" }}
                      ></i>
                      <Text>Home</Text>
                    </Flex>
                  </ChakraLink>
                  <ChakraLink
                    onClick={() => {
                      handleScroll("about");
                      onClose();
                    }}
                    fontSize={responsive("", "md", "lg")}
                    opacity={0.8}
                    fontWeight={"500"}
                    _hover={{
                      textDecoration: "none",
                      opacity: 1,
                      color: "black",
                    }}
                  >
                    <Flex align={"center"} gap={".5em"}>
                      <i
                        class="fi fi-rr-info"
                        style={{ position: "relative", top: "1px" }}
                      ></i>
                      <Text>About us</Text>
                    </Flex>
                  </ChakraLink>
                  <ChakraLink
                    onClick={() => {
                      handleScroll("courses");
                      onClose();
                    }}
                    fontSize={responsive("", "md", "lg")}
                    opacity={0.8}
                    fontWeight={"500"}
                    _hover={{
                      textDecoration: "none",
                      opacity: 1,
                      color: "black",
                    }}
                  >
                    <Flex align={"center"} gap={".5em"}>
                      <i
                        class="fi fi-rr-book-alt"
                        style={{ position: "relative", top: "1px" }}
                      ></i>
                      <Text>Courses</Text>
                    </Flex>
                  </ChakraLink>
                  <ChakraLink
                    onClick={() => {
                      handleScroll("instructors");
                      onClose();
                    }}
                    fontSize={responsive("", "md", "lg")}
                    opacity={0.8}
                    fontWeight={"500"}
                    _hover={{
                      textDecoration: "none",
                      opacity: 1,
                      color: "black",
                    }}
                  >
                    <Flex align={"center"} gap={".5em"}>
                      <i
                        class="fi fi-rr-chalkboard-user"
                        style={{ position: "relative", top: "1px" }}
                      ></i>
                      <Text>Instructors</Text>
                    </Flex>
                  </ChakraLink>
                  <ChakraLink
                    onClick={() => {
                      handleScroll("events");
                      onClose();
                    }}
                    fontSize={responsive("", "md", "lg")}
                    opacity={0.8}
                    fontWeight={"500"}
                    _hover={{
                      textDecoration: "none",
                      opacity: 1,
                      color: "black",
                    }}
                  >
                    <Flex align={"center"} gap={".5em"}>
                      <i
                        class="fi fi-rr-calendar-day"
                        style={{ position: "relative", top: "1px" }}
                      ></i>
                      <Text>Events</Text>
                    </Flex>
                  </ChakraLink>
                  {account && (
                    <>
                      <hr />
                      {account.role === "student" ? (
                        <ChakraLink
                          as={Link}
                          to="/enrollments"
                          fontSize={responsive("", "md", "lg")}
                          opacity={0.8}
                          fontWeight={"500"}
                          transition={"all 0.5s ease"}
                          _hover={{
                            textDecoration: "none",
                            opacity: 1,
                            color: "black",
                          }}
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
                            to="/dashboard"
                            fontSize={responsive("", "md", "lg")}
                            opacity={0.8}
                            fontWeight={"500"}
                            transition={"all 0.5s ease"}
                            _hover={{
                              textDecoration: "none",
                              opacity: 1,
                              color: "black",
                            }}
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
                        opacity={0.8}
                        fontWeight={"500"}
                        transition={"all 0.5s ease"}
                        _hover={{
                          textDecoration: "none",
                          opacity: 1,
                          color: "black",
                        }}
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
                        opacity={0.8}
                        fontWeight={"500"}
                        transition={"all 0.5s ease"}
                        _hover={{
                          textDecoration: "none",
                          opacity: 1,
                          color: "black",
                        }}
                      >
                        <i
                          class="fi fi-rr-sign-out-alt"
                          style={{ position: "relative", top: "3px" }}
                        ></i>
                        &nbsp; Logout
                      </ChakraLink>
                    </>
                  )}
                </Flex>
              </DrawerBody>
              <DrawerFooter justifyContent={"space-between"}>
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
                  <Center
                    p={".5em"}
                    w={"100%"}
                    border={"2px dashed #cfcfcf"}
                    bgColor={"white"}
                    borderRadius={"10px"}
                    color={"black"}
                    fontWeight={"500"}
                    opacity={0.8}
                    fontSize={responsive("sm", "md", "lg")}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {account.username}
                  </Center>
                )}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <>
          <Box id="home"></Box>
          <Box
            transform={
              !isMenuOpen &&
              (navVisible ? "translateY(0)" : "translateY(-150%)")
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
                <Image
                  w={responsive("", "3em", "5em")}
                  src="/hayvan.png"
                ></Image>
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
                  _hover={{
                    textDecoration: "none",
                    opacity: 1,
                    color: "black",
                  }}
                >
                  Home
                </ChakraLink>
                <ChakraLink
                  onClick={() => handleScroll("about")}
                  fontSize={responsive("", "md", "lg")}
                  opacity={0.8}
                  fontWeight={"500"}
                  _hover={{
                    textDecoration: "none",
                    opacity: 1,
                    color: "black",
                  }}
                >
                  About us
                </ChakraLink>
                <ChakraLink
                  onClick={() => handleScroll("courses")}
                  fontSize={responsive("", "md", "lg")}
                  opacity={0.8}
                  fontWeight={"500"}
                  _hover={{
                    textDecoration: "none",
                    opacity: 1,
                    color: "black",
                  }}
                >
                  Courses
                </ChakraLink>
                <ChakraLink
                  onClick={() => handleScroll("instructors")}
                  fontSize={responsive("", "md", "lg")}
                  opacity={0.8}
                  fontWeight={"500"}
                  _hover={{
                    textDecoration: "none",
                    opacity: 1,
                    color: "black",
                  }}
                >
                  Instructors
                </ChakraLink>
                <ChakraLink
                  onClick={() => handleScroll("events")}
                  fontSize={responsive("", "md", "lg")}
                  opacity={0.8}
                  fontWeight={"500"}
                  _hover={{
                    textDecoration: "none",
                    opacity: 1,
                    color: "black",
                  }}
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
                          left={"50%"}
                          transform={"translateX(-50%)"}
                          width={"max-content"}
                          borderRadius={"10px"}
                          mt={".5em"}
                        >
                          {account.role === "student" ? (
                            <ChakraLink
                              as={Link}
                              to="/enrollments"
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
                                to="/dashboard"
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
      )}
    </>
  );
};

export default Header;
