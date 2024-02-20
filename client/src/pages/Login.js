import {
  Flex,
  Box,
  Center,
  Input,
  Button,
  FormControl,
  InputRightElement,
  Link as ChakraLink,
  FormLabel,
  Tooltip,
  useToast,
  InputGroup,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import dataContext from "../utils/contextApi";
import { loginUser } from "../utils/data/UsersData";
const Login = () => {
  const { isMobile, isLaptop } = useContext(dataContext);

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
        localStorage.setItem("isLoggedIn", true);
        navigate("/");
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

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Center
        h={"100vh"}
        bgImg={"./image.png"}
        bgPos={"center"}
        position={"relative"}
      >
        <Box
          position={"absolute"}
          top={0}
          left={0}
          backdropFilter={"blur(5px)"}
          bgColor={"rgba(0,0,0,0.1)"}
          w={"100%"}
          h={"100%"}
          zIndex={"1"}
        ></Box>
        <Box position={"relative"} zIndex={2} w={"35%"}>
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
                    <Tooltip
                      label="Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
                      placement="top"
                      bgColor={"var(--accent-color)"}
                      borderRadius={"5px"}
                      p={"0.5em"}
                      hasArrow
                    >
                      Password
                    </Tooltip>
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
