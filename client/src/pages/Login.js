import {
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Center,
  Input,
  Button,
  FormControl,
  InputRightElement,
  Link as ChakraLink,
  FormLabel,
  useToast,
  InputGroup,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useContext, useEffect } from "react";
import dataContext from "../utils/contextApi";
import { loginUser } from "../utils/data/UsersData";
import Cookies from "js-cookie";

const Login = () => {
  const { isMobile, isLaptop, setTargetScroll, setErrors, errors } =
    useContext(dataContext);

  const [passwordShow, setPasswordShow] = useState(false);
  const handleClick = () => setPasswordShow(!passwordShow);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

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
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(login)
      .then(() => {
        toast({
          title: "login successful",
          description: "you are now logged in",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        Cookies.set("isLoggedIn", true, { expires: 1 });
        navigate("/");
      })
      .catch((error) => {
        setErrors([...errors, error]);
      });
  };

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setTargetScroll("home");
  }, []);

  return (
    <>
      <Center h={"100vh"} bgPos={"center"} position={"relative"}>
        <Box
          pos={"absolute"}
          top={responsive("", "1.5em", "2em")}
          left={responsive("", "1.5em", "2em")}
          p={responsive("", "1em", "1em 2em")}
          bgColor={"var(--secondary-color)"}
          w={"max-content"}
        >
          <Heading
            color={"white"}
            fontSize={responsive("", "xl", "2xl")}
            fontWeight={"600"}
            mb={"1em"}
          >
            Login
          </Heading>
          <Breadcrumb
            color={"white"}
            spacing="8px"
            separator={<ChevronRightIcon color="white" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to="/"
                onClick={() => setTargetScroll("")}
                fontWeight={500}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink fontWeight={500} as={Link} to={"/login"}>
                Login
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Box position={"relative"} w={"35%"}>
          <Box
            pos={"absolute"}
            top={responsive("", "-3em", "-4em")}
            right={responsive("", "-3em", "-4em")}
            zIndex={-1}
            w={responsive("", "8em", "10em")}
            h={responsive("", "8em", "10em")}
            bgColor={"var(--secondary-color)"}
          ></Box>
          <Box
            bgColor={"white"}
            p={responsive("", "2em 3em", "4em 5em")}
            pb={responsive("", "2em", "3em")}
            borderRadius={"10px"}
            boxShadow={"0 0 50px 0 rgba(0,0,0,0.2)"}
            border={"2px dashed  #cfcfcf"}
          >
            <form onSubmit={handleSubmit}>
              <Flex flexDirection={"column"} gap={"1em"}>
                <FormControl isRequired>
                  <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                    Email
                  </FormLabel>
                  <Input
                    h={responsive("", "2.5em", "3em")}
                    variant={"outline"}
                    border={"1px solid rgba(0,0,0,0.2)"}
                    type="text"
                    name="email"
                    value={login.email}
                    onChange={handleLoginChange}
                    _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    _focus={{ border: "1px solid var(--secondary-color)" }}
                    _active={{ bgColor: "transparent" }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={responsive("", "1em", "1.2em")}>
                    Password
                  </FormLabel>
                  <InputGroup display={"flex"} alignItems={"center"}>
                    <Input
                      h={responsive("", "2.5em", "3em")}
                      variant={"outline"}
                      border={"1px solid rgba(0,0,0,0.2)"}
                      type={passwordShow ? "text" : "password"}
                      name="password"
                      pr={"4.5rem"}
                      value={login.password}
                      onChange={handleLoginChange}
                      _hover={{ border: "1px solid rgba(0,0,0,0.2)" }}
                      _focus={{ border: "1px solid var(--secondary-color)" }}
                      _active={{ bgColor: "transparent" }}
                    />

                    <InputRightElement width="4.5rem" top={"unset"}>
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {passwordShow ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Flex>
              <Flex flexDir={"column"} gap={"1em"} mt={"2em"}>
                <Button
                  variant={"solid"}
                  type="submit"
                  bgColor={"var(--secondary-color)"}
                  w={"100%"}
                  p={"1.3em"}
                  fontSize={responsive("", "1em", "1.2em")}
                  border={"1px solid transparent"}
                  color={"white"}
                  _hover={{
                    bgColor: "transparent",
                    border: "1px solid var(--secondary-color)",
                    color: "var(--secondary-color)",
                  }}
                >
                  Login
                </Button>
                <ChakraLink as={Link} to={"/signup"} ml={"1em"}>
                  {" "}
                  Are you not registered?
                </ChakraLink>
              </Flex>
            </form>
          </Box>
          <Box
            pos={"absolute"}
            bottom={responsive("", "-3em", "-4em")}
            left={responsive("", "-3em", "-4em")}
            zIndex={-1}
            w={responsive("", "8em", "10em")}
            h={responsive("", "8em", "10em")}
            bgColor={"var(--secondary-color)"}
          ></Box>
        </Box>
      </Center>
    </>
  );
};

export default Login;
